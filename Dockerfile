FROM node:22-bookworm-slim AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build
RUN npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/node_modules ./node_modules
COPY package.json ./
COPY prisma ./prisma
COPY server ./server
COPY public ./public
COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["npm", "run", "start:railway"]
