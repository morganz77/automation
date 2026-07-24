# ---- Build stage: install all deps and compile TypeScript to dist/ ----
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY types ./types
RUN npm run build

# ---- Runtime stage: production deps + compiled output only ----
FROM node:22-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 8080
CMD [ "node", "dist/server.js" ]
