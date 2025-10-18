# Set build stage via ARG
ARG buildArg=staging

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

ENV PORT=30000
EXPOSE 30000

RUN addgroup --system --gid 1001 dev && adduser --system --uid 1001 --ingroup dev dev

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/package.json ./

USER dev

CMD ["npm", "run", "start"]