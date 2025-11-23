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
RUN mkdir -p /tmp/prod
COPY package.json bun.lock /tmp/prod/
RUN cd /tmp/prod/ && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY . .
COPY --from=deps /tmp/prod/node_modules node_modules
RUN bun test

FROM prerelease AS builder
RUN bun build --compile ./index.ts --outfile ./server

# STAGE 3: Final release image
FROM gcr.io/distroless/base-debian12 AS release
WORKDIR /app

COPY --from=builder /app/server .
COPY --from=builder /app/database ./database

ENV NODE_ENV=production
USER nonroot:nonroot
CMD ["./server"]
