# LeoLink Backend

<div align="center">
  <h3>Uma rede social voltada para o mundo acadêmico</h3>
  <p>Desenvolvida pelos alunos da Uniasselvi - Turmas: EGS0011, EGS0016 e EGS0019</p>
</div>

---

## 🚀 Sobre o Projeto

O **LeoLink** é uma plataforma de rede social desenvolvida especificamente para o ambiente acadêmico, permitindo que estudantes, professores e pesquisadores se conectem, compartilhem conhecimento e colaborem em projetos educacionais.

Este repositório contém o backend da aplicação, desenvolvido com as mais modernas tecnologias para garantir performance, escalabilidade e segurança.

## 🛠️ Tecnologias Utilizadas

### Backend
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[NestJS](https://nestjs.com/)** - Framework Node.js progressivo para aplicações server-side
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript com tipagem estática
- **[TypeORM](https://typeorm.io/)** - ORM para TypeScript/JavaScript

### Banco de Dados
- **[PostgreSQL](https://www.postgresql.org/)** - Sistema de gerenciamento de banco de dados relacional

### Autenticação & Segurança
- **[JWT](https://jwt.io/)** - JSON Web Tokens para autenticação
- **[@node-rs/argon2](https://github.com/napi-rs/node-rs)** - Hash de senhas com Argon2

### Validação & Documentação
- **[Class-validator](https://github.com/typestack/class-validator)** - Validação baseada em decorators
- **[Class-transformer](https://github.com/typestack/class-transformer)** - Transformação de objetos
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação automática da API

### DevOps & Deployment
- **[Docker](https://www.docker.com/)** - Containerização
- **[Docker Compose](https://docs.docker.com/compose/)** - Orquestração de containers

### Ferramentas de Desenvolvimento
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Husky](https://typicode.github.io/husky/)** - Git hooks

## 📁 Estrutura do Projeto

```
src/
├── common/           # Utilitários compartilhados
│   ├── decorators/   # Decorators customizados
│   ├── dtos/         # Data Transfer Objects base
│   ├── entities/     # Entidades base
│   ├── exceptions/   # Exceções customizadas
│   ├── filters/      # Filtros globais
│   ├── interceptors/ # Interceptors globais
│   └── repositories/ # Repositórios base
├── modules/          # Módulos da aplicação
│   ├── auth/         # Módulo de autenticação
│   │   └── dtos/     # DTOs específicos do auth
│   │       ├── login/        # DTOs do login
│   │       ├── logout/       # DTOs do logout
│   │       ├── me/           # DTOs do perfil
│   │       └── change-password/ # DTOs de mudança de senha
│   └── users/        # Módulo de usuários
│       └── dtos/     # DTOs específicos de usuários
│           ├── create-user/     # DTOs de criação
│           ├── update-user/     # DTOs de atualização
│           ├── get-user/        # DTOs de busca
│           ├── index-users/     # DTOs de listagem
│           ├── delete-user/     # DTOs de exclusão
│           ├── activate-user/   # DTOs de ativação
│           └── shared/          # DTOs comuns (UserDto)
├── app.module.ts     # Módulo principal
└── main.ts          # Arquivo de entrada
```

## 🔧 Funcionalidades

### Autenticação
- ✅ Login com JWT
- ✅ Logout seguro
- ✅ Proteção de rotas
- ✅ Hash de senhas com Argon2

### Gerenciamento de Usuários
- ✅ Criação de usuários
- ✅ Ativação de conta
- ✅ Atualização de perfil
- ✅ Exclusão lógica (soft delete)
- ✅ Listagem paginada

### Arquitetura
- ✅ Clean Architecture
- ✅ Repository Pattern
- ✅ Use Cases
- ✅ DTOs para validação
- ✅ Tratamento global de exceções
- ✅ Interceptors para formatação de resposta

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v22.16.0 é a indicada)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/LeoLink-Uniasselvi/leolink-backend.git
cd leolink-backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no exemplo:

```env
# Configurações da Aplicação
APP_PORT=5000
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_USER=leolink
DB_PASS=leolink123
DB_NAME=leolink
DB_LOGGING=true

# Configurações JWT
JWT_SECRET=seu_jwt_secret_super_seguro_aqui
```

### 4. Execute o projeto

#### Opção 1: Usando o script de desenvolvimento (Recomendado)
```bash
chmod +x dev.sh
./dev.sh
```

#### Opção 2: Passo a passo
```bash
# Subir o banco de dados
docker compose up db -d

# Executar a aplicação em modo desenvolvimento
npm run start:dev
```

### 5. Acesse a aplicação

- **API**: http://localhost:5000
- **Documentação (Swagger)**: http://localhost:5000/docs

## 📚 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev      # Inicia em modo desenvolvimento com hot reload
npm run start:debug    # Inicia em modo debug

# Build e Produção
npm run build          # Compila o projeto
npm run start:prod     # Inicia em modo produção

# Qualidade de Código
npm run lint           # Executa o ESLint
npm run format         # Formata o código com Prettier
```

## 🐳 Docker

### Executar com Docker Compose

```bash
# Subir todos os serviços
docker compose up

# Subir em background
docker compose up -d

# Parar os serviços
docker compose down

# Rebuild dos containers
docker compose up --build
```

## 📖 Documentação da API

A documentação completa da API está disponível através do Swagger UI em:
http://localhost:5000/docs

A documentação inclui:
- Todos os endpoints disponíveis
- Modelos de dados
- Exemplos de requisições e respostas
- Autenticação JWT

## 🤝 Como Contribuir

Consulte o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para informações detalhadas sobre como contribuir com o projeto.

## 📄 Licença

Este projeto é privado e desenvolvido para fins acadêmicos pela Uniasselvi.

## 👥 Equipe

Desenvolvido pelos alunos das turmas EGS0011, EGS0016 e EGS0019 da Uniasselvi.

---

<div align="center">
  <p>Feito com ❤️ pelos alunos da Uniasselvi</p>
</div>
