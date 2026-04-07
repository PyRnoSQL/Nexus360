FROM node:20-alpine

RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/

RUN pnpm install --frozen-lockfile --prod=false

COPY . .

RUN pnpm build --filter=@nexus360/api

WORKDIR /app/apps/api

RUN mkdir -p uploads

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "dist/index.js"]
