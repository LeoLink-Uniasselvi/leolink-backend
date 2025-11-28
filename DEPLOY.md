# 🚀 LeoLink Backend - Deploy no Render com Docker

## Quick Start

### Runtime: Docker ⚠️ IMPORTANTE!

Quando criar o Web Service no Render, selecione **Runtime: Docker**

O Render usará automaticamente o `Dockerfile` na raiz do projeto.

### Variáveis de Ambiente Necessárias no Render

```env
NODE_ENV=production
DB_HOST=<seu-db-host>.oregon-postgres.render.com
DB_PORT=5432
DB_USER=<gerado-pelo-render>
DB_PASS=<gerado-pelo-render>
DB_NAME=leolink
JWT_SECRET=<gere-um-secret-forte>
CORS_ORIGIN=http://localhost:3000,https://seu-frontend.onrender.com
DB_LOGGING=false
```

⚠️ **NÃO** defina `PORT` - Render preenche automaticamente

### Dockerfile

O projeto já inclui um `Dockerfile` otimizado:
- Multi-stage build (reduz tamanho da imagem)
- Apenas dependências de produção no container final
- Healthcheck integrado
- Build otimizado com cache

### Build Process

Quando você fizer push para o GitHub:

1. Render detecta mudanças
2. Executa `docker build` usando o Dockerfile
3. Cria imagem otimizada (2 stages)
4. Executa container
5. Healthcheck verifica se app está rodando
6. Deploy completo!

## Comandos - NÃO NECESSÁRIOS com Docker

❌ **Build Command**: (deixe vazio - Docker cuida disso)
❌ **Start Command**: (deixe vazio - Docker cuida disso)

O Dockerfile já define tudo via `CMD`!

### Health Check

- **Path**: `/health`
- **Expected Response**: `{ uptime: number, message: "API está rodando", version: "..." }`

## Documentação Completa

Veja [DEPLOY_RENDER.md](../DEPLOY_RENDER.md) na raiz do projeto para instruções completas.

## Comandos Úteis

```bash
# Build local
npm run build

# Start produção local
npm run start:prod

# Verificar build
node dist/main.js
```

## Troubleshooting

### Erro de conexão com DB
- Verifique se está usando **Internal Database URL**
- Confirme que todas as variáveis DB_* estão corretas
- Verifique logs no Render Dashboard

### CORS Error
- Adicione URL do frontend em `CORS_ORIGIN`
- Formato: URLs separadas por vírgula, sem espaços
- Exemplo: `http://localhost:3000,https://app.onrender.com`
