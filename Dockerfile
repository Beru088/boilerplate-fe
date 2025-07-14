# Set build stage via ARG
ARG buildArg=staging

### 1. Builder Stage
FROM node:18.20.8-alpine3.21 AS builder
WORKDIR /app

COPY package.json ./
COPY .npmrc ./
RUN npm install

COPY . .

ARG buildArg
# COPY env.${buildArg} .env

RUN npm run build

FROM node:18.20.8-alpine3.21 AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package.json ./

CMD ["npm", "run", "start"]