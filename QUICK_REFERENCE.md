# ⚡ Quick Reference - Comandos Úteis

## 🏠 Desenvolvimento Local

```bash
# Configurar ambiente pela primeira vez
cp .env.example .env
docker-compose up -d
npm install
npm run start:dev

# Parar tudo
docker-compose down
```

## ☁️ Produção (Render)

### Gerar JWT_SECRET seguro
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Conectar ao banco de produção (psql)
```bash
PGPASSWORD=XZdX3XRxbI04ZYnsUrkPiUpH2AsIK6hl psql -h dpg-d4kgehc9c44c73euh74g-a.oregon-postgres.render.com -U db_tqk2_user db_tqk2
```

### Variáveis de Ambiente (Render Dashboard)
```env
DB_HOST=dpg-d4kgehc9c44c73euh74g-a
DB_PORT=5432
DB_USER=db_tqk2_user
DB_PASS=XZdX3XRxbI04ZYnsUrkPiUpH2AsIK6hl
DB_NAME=db_tqk2
NODE_ENV=production
JWT_SECRET=<GERE_COM_COMANDO_ACIMA>
CORS_ORIGIN=http://localhost:3000,https://seu-frontend.onrender.com
DB_LOGGING=false
```

## 🔄 Testar Conexão

### Local
```bash
curl http://localhost:5000/health
curl http://localhost:5000/docs
```

### Produção
```bash
curl https://seu-app.onrender.com/health
curl https://seu-app.onrender.com/docs
```

## 🐳 Docker

### Desenvolvimento (docker-compose)
```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Reconstruir
docker-compose up -d --build

# Limpar tudo
docker-compose down -v
```

### Produção (Dockerfile)
```bash
# Build local (teste)
docker build -t leolink-backend .

# Rodar localmente
docker run -p 5000:5000 --env-file .env.production leolink-backend

# No Render, isso é automático!
```

## 📦 Deploy

```bash
# Commit e push
git add .
git commit -m "Update configuration"
git push origin main

# Render fará deploy automático!
```

## 🔍 Debug

### Ver logs no Render
1. Acesse Render Dashboard
2. Clique no seu Web Service
3. Vá em **Logs**

### Executar comandos no Render (Shell)
1. No Web Service, clique em **Shell**
2. Execute comandos:
```bash
npm run migration:run
node -v
npm list
```

## 📊 Banco de Dados

### Migrations
```bash
# Criar nova migration
npm run migration:create -- -n NomeDaMigration

# Executar migrations
npm run migration:run

# Reverter última migration
npm run migration:revert
```

### Verificar conexão
```bash
# Local
docker exec -it leolink-db psql -U leolink_user -d leolink

# Produção (via psql local)
PGPASSWORD=XZdX3XRxbI04ZYnsUrkPiUpH2AsIK6hl psql -h dpg-d4kgehc9c44c73euh74g-a.oregon-postgres.render.com -U db_tqk2_user db_tqk2
```

## 🎯 Checklist de Deploy

- [ ] `.env.production` configurado localmente (para testes)
- [ ] Variáveis de ambiente configuradas no Render Dashboard
- [ ] JWT_SECRET gerado (32+ caracteres aleatórios)
- [ ] CORS_ORIGIN inclui URL do frontend
- [ ] Runtime do Render = **Docker**
- [ ] Build rodou com sucesso
- [ ] `/health` retorna status 200
- [ ] `/docs` acessível (Swagger)
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar criação de post

## 🆘 Problemas Comuns

### Build falha no Render
```bash
# Verifique:
- Dockerfile está na raiz do backend?
- Runtime está como "Docker"?
- Tem node_modules no .dockerignore?
```

### Erro de conexão com DB
```bash
# Verifique:
- DB_HOST correto? (use hostname interno no Render)
- DB_PASS sem espaços ou caracteres especiais?
- PostgreSQL está rodando?
```

### CORS Error no frontend
```bash
# Adicione URL do frontend em CORS_ORIGIN:
CORS_ORIGIN=https://leolink-frontend.onrender.com,http://localhost:3000
```

### 502 Bad Gateway
```bash
# Significa que o app não está escutando na porta correta
# Verifique main.ts:
await app.listen(port, '0.0.0.0');
# port deve vir de process.env.PORT
```
