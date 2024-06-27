FROM node:lts AS build
WORKDIR /app
COPY . .
RUN corepack enable && \
    pnpm install --frozen-lockfile && \
    pnpm run build

FROM node:lts AS runtime
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321
CMD node ./dist/server/entry.mjs
