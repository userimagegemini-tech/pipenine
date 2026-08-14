import { useEffect, useRef, useState } from 'react';
import { ArrowUp, Bot, MessageCircle, RotateCcw, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const welcomeMessage = {
  role: 'assistant',
  content: 'Welcome to Mühlenbruch Insurance Help. I can explain the insurance options shown on this website, help you find office and contact details, and walk you through requesting a free quote. What can I help you with today?',
};

const suggestions = [
  'Explore insurance options',
  'Help me request a quote',
  'Find office and contact details',
  'Why choose Mühlenbruch Insurance?',
];

export default function Chatbot() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 180);
  }, [open]);

  if (location.pathname.startsWith('/admin')) return null;

  const sendMessage = async (text) => {
    const cleanText = String(text || '').trim();
    if (!cleanText || sending) return;
    const nextMessages = [...messages, { role: 'user', content: cleanText }];
    setMessages(nextMessages);
    setInput('');
    setSending(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-8) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'The assistant is unavailable right now.');
      setMessages((current) => [...current, { role: 'assistant', content: data.answer }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        content: `${error.message} You can still call 515-852-4156 or use the Contact Us form.`,
        error: true,
      }]);
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    setMessages([welcomeMessage]);
    setInput('');
  };

  return <div className={`ai-chat ${open ? 'is-open' : ''}`}>
    {open && <section className="ai-chat-panel" role="dialog" aria-label="Mühlenbruch Insurance Help">
      <header className="ai-chat-header">
        <span className="ai-chat-avatar"><Bot size={19}/></span>
        <div><strong>Insurance Help</strong><small><i/> Online now · AI-powered</small></div>
        <button type="button" onClick={resetChat} aria-label="Start a new chat" title="Start a new chat"><RotateCcw size={16}/></button>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button>
      </header>
      <div className="ai-chat-messages" ref={messagesRef} aria-live="polite">
        {messages.map((message, index) => <div key={`${message.role}-${index}`} className={`ai-chat-message ${message.role} ${message.error ? 'error' : ''}`}>
          {message.role === 'assistant' && <Bot size={15}/>}<p>{message.content}</p>
        </div>)}
        {sending && <div className="ai-chat-message assistant"><Bot size={15}/><p className="ai-chat-typing"><i/><i/><i/><span className="sr-only">Assistant is typing</span></p></div>}
        {messages.length === 1 && <div className="ai-chat-suggestions">{suggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>{suggestion}</button>)}</div>}
      </div>
      <form className="ai-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage(input); }}>
        <label><span className="sr-only">Ask an insurance question</span><textarea ref={inputRef} rows="1" maxLength="500" value={input} placeholder="Ask about insurance or a quote…" onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(input); } }}/></label>
        <button type="submit" disabled={sending || !input.trim()} aria-label="Send message"><ArrowUp size={17}/></button>
      </form>
      <small className="ai-chat-note">General website information only. A licensed agent will confirm coverage, eligibility, and pricing.</small>
    </section>}
    <button className="ai-chat-toggle" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? 'Close Insurance Help' : 'Open Insurance Help'}>
      {open ? <X size={23}/> : <MessageCircle size={25}/>}<span>{open ? 'Close' : 'Insurance Help'}</span>
    </button>
  </div>;
}
