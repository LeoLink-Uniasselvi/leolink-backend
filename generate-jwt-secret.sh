#!/bin/bash
# Script para gerar JWT_SECRET seguro

echo "🔐 Gerando JWT_SECRET seguro..."
echo ""

JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo "✅ JWT_SECRET gerado com sucesso!"
echo ""
echo "Copie e use este valor:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 Configure no Render:"
echo "   Environment → JWT_SECRET = $JWT_SECRET"
echo ""
