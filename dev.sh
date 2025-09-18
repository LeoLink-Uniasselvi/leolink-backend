echo "Iniciando ambiente de desenvolvimento..."
npm install
docker compose up db -d
npm run start:dev