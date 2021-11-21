# Pinyin API

wrangler dev index.ts --local

#### Deploy

```
wrangler publish index.ts --name=api
```

PRISMA_CLIENT_ENGINE_TYPE=dataproxy npx prisma generate

https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-cloudflare-workers
