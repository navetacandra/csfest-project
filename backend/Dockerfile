# Compressing bun
FROM oven/bun:1 AS bun

FROM alpine:3 AS alpine
RUN apk add --no-cache upx
COPY --from=bun /usr/local/bin/bun /usr/local/bin/
RUN upx --all-methods --lzma /usr/local/bin/bun

# Build app
FROM bun AS base
WORKDIR /app
COPY --from=alpine /usr/local/bin/bun /usr/local/bin/

FROM base AS deps
# dev
RUN mkdir -p /tmp/dev
COPY package.json bun.lock /tmp/dev/
RUN cd /tmp/dev/ && bun install --frozen-lockfile
# prod
RUN mkdir -p /tmp/prod
COPY package.json bun.lock /tmp/prod/
RUN cd /tmp/prod/ && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY . .

FROM prerelease AS test
COPY --from=deps /tmp/dev/node_modules node_modules
RUN bun test

FROM prerelease AS builder
COPY --from=deps /tmp/prod/node_modules node_modules
RUN bun build --compile ./index.ts --outfile ./server

FROM gcr.io/distroless/base-debian12 AS release
WORKDIR /app

COPY --from=builder /app/server .

# Create database directory and set permissions
RUN mkdir -p ./database && chown nonroot:nonroot ./database
COPY --from=builder /app/database/schema.sql ./database/ 2>/dev/null || true
COPY --from=builder /app/database/migrations ./database/migrations/
COPY --from=builder /app/database/seeds ./database/seeds/
RUN chown -R nonroot:nonroot ./database

ENV NODE_ENV=production
USER nonroot:nonroot
CMD ["./server"]
