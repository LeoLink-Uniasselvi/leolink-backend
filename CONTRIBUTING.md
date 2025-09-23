# Guia de Contribuição - LeoLink Backend

Obrigado por seu interesse em contribuir com o projeto LeoLink! Este documento fornece todas as informações necessárias para contribuir de forma efetiva e seguir os padrões estabelecidos pela equipe.

## 📋 Sumário

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
5. [Padrões de Commit](#padrões-de-commit)
6. [Documentação](#documentação)

## 📜 Código de Conduta

Este projeto segue um código de conduta baseado nos valores acadêmicos da Uniasselvi:

- **Respeito**: Trate todos os membros da equipe com cortesia e profissionalismo
- **Colaboração**: Trabalhe em equipe e compartilhe conhecimento
- **Qualidade**: Mantenha sempre os altos padrões de código
- **Aprendizado**: Veja cada contribuição como uma oportunidade de crescimento

## 🚀 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU_USUARIO/leolink-backend.git
cd leolink-backend

# Adicione o repositório original como upstream
git remote add upstream https://github.com/LeoLink-Uniasselvi/leolink-backend.git
```

### 2. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch para sua funcionalidade
git checkout -b feature/nome-da-funcionalidade
# ou para correção de bug
git checkout -b fix/nome-do-bug
```

### 3. Faça suas Alterações

Desenvolva sua funcionalidade seguindo os [padrões estabelecidos](#padrões-de-desenvolvimento).

### 4. Commit e Push

```bash
# Adicione suas alterações
git add .

# Faça commit seguindo o padrão de commits
git commit -m "feat: adiciona autenticação com 2FA"

# Envie para seu fork
git push origin feature/nome-da-funcionalidade
```

### 5. Abra um Pull Request

1. Vá até o repositório original no GitHub
2. Clique em "New Pull Request"
3. Selecione sua branch
4. Preencha o template de PR (veja seção [Pull Requests](#pull-requests))

## ⚙️ Configuração do Ambiente

### Pré-requisitos Obrigatórios

- **Node.js** versão 18 ou superior
- **Docker** e **Docker Compose**
- **Git** configurado com seu nome e email
- **VS Code** (recomendado) com as extensões:
  - ESLint
  - Prettier
  - Thunder Client (para testes de API)

### Configuração Inicial

```bash
# 1. Instale as dependências
npm install

# 2. Configure o ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Configure os hooks do Git
npx husky install

# 4. Verifique se tudo está funcionando
npm run lint
npm test
```

## 🎯 Padrões de Desenvolvimento

### Arquitetura

O projeto segue **Clean Architecture** com os seguintes princípios:

- **Módulos**: Cada funcionalidade deve estar em seu próprio módulo
- **Use Cases**: Lógica de negócio isolada em casos de uso
- **Repository Pattern**: Abstração da camada de dados
- **DTOs**: Validação e transformação de dados
- **Entities**: Modelos de domínio

### Estrutura de Pastas (OBRIGATÓRIO)

```
src/modules/exemplo/
├── exemplo.controller.ts     # Controller com endpoints
├── exemplo.module.ts         # Módulo NestJS
├── exemplo.adapter.ts        # Adaptador (se necessário)
├── dtos/                     # Data Transfer Objects
│   ├── index.ts             # Exports centralizados 
│   ├── create-exemplo/
│   │   ├── create-exemplo.form.dto.ts
│   │   └── create-exemplo.response.dto.ts
│   ├── update-exemplo/
│   │   ├── update-exemplo.form.dto.ts
│   │   └── update-exemplo.response.dto.ts
│   ├── get-exemplo/
│   │   └── get-exemplo.response.dto.ts
│   └── shared/
│       └── exemplo.response.dto.ts  # DTO comum reutilizável
├── entities/
│   └── exemplo.entity.ts
├── exceptions/
│   ├── exemplo.exceptions.ts
│   └── index.ts
├── repositories/
│   ├── exemplo.repository.ts
└── use-cases/
    ├── index.ts
    └── create-exemplo/
        ├── create-exemplo.use-case.ts
        └── index.ts
```

### Padrões de Código (OBRIGATÓRIO)

#### 1. Nomenclatura

```typescript
// ✅ CORRETO
class UserRepository {}
interface CreateUserDto {}
enum UserStatus {}
const getUserById = () => {};

// ❌ INCORRETO
class userRepository {}
interface createUserDto {}
enum userStatus {}
const GetUserById = () => {};
```

#### 2. Imports

```typescript
// ✅ CORRETO - Sempre use @ para imports internos
import { UserEntity } from '@/modules/users/entities';
import { CreateUserDto } from '@/modules/users/dtos';

// ❌ INCORRETO - Não use imports relativos
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
```

#### 3. DTOs (OBRIGATÓRIO)
```typescript
// ✅ CORRETO - DTOs organizados por use-case

// src/modules/users/dtos/create-user/create-user.form.dto.ts
export class CreateUserFormDto {
  @IsString()
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase())
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// src/modules/users/dtos/create-user/create-user.response.dto.ts
export class CreateUserResponseDto extends BaseResponseDto<UserDto> {
  @ApiProperty({
    description: 'Dados do usuário criado',
    example: { /* exemplo completo */ }
  })
  declare data: UserDto;
}

// src/modules/users/dtos/shared/user.response.dto.ts - DTO comum
export class UserDto {
  @ApiProperty({ description: 'ID único do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ description: 'Status de ativação' })
  isActive: boolean;
}
```

**Estrutura obrigatória de DTOs:**
- **Form DTOs**: Sempre terminam com `.form.dto.ts` (dados de entrada)
- **Response DTOs**: Sempre terminam com `.response.dto.ts` (dados de saída)
- **DTOs comuns**: Ficam na pasta `shared/` e são reutilizáveis
- **Organização**: Cada use-case tem sua própria pasta com seus DTOs específicos

#### 4. Controllers (OBRIGATÓRIO)

```typescript
// ✅ CORRETO
@Controller('users')
@ApiTags('Usuários')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  async create(@Body() dto: CreateUserDto): Promise<CreateUserResponseDto> {
    const user = await this.createUserUseCase.execute(dto);
    return UserAdapter.toResponseDto(user);
  }
}
```

#### 5. Use Cases (OBRIGATÓRIO)

```typescript
// ✅ CORRETO
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordHashingService,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    // Validações de negócio
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new EmailAlreadyExistsException();
    }

    // Lógica de negócio
    const hashedPassword = await this.passwordService.hash(dto.password);
    
    const user = new UserEntity({
      ...dto,
      password: hashedPassword,
    });

    return this.userRepository.create(user);
  }
}
```

### Tratamento de Erros (OBRIGATÓRIO)

```typescript
// ✅ CORRETO - Crie exceções específicas
export class EmailAlreadyExistsException extends DomainException {
  constructor() {
    super('EMAIL_ALREADY_EXISTS', 'Este email já está em uso', 409);
  }
}

// Use nas use cases
if (existingUser) {
  throw new EmailAlreadyExistsException();
}
```

## 📝 Padrões de Commit (OBRIGATÓRIO)

### Formato

```
<tipo>(escopo): <descrição>

<corpo opcional>

<rodapé opcional>
```

### Tipos Obrigatórios

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação (não afeta o código)
- **refactor**: Refatoração
- **test**: Testes
- **chore**: Tarefas de build, configuração, etc.

### Exemplos

```bash
# ✅ CORRETO
git commit -m "feat(auth): adiciona autenticação com JWT"
git commit -m "fix(users): corrige validação de email"
git commit -m "docs: atualiza README com instruções de instalação"
git commit -m "test(users): adiciona testes para criação de usuário"

# ❌ INCORRETO
git commit -m "Adicionei login"
git commit -m "Bug fix"
git commit -m "update"
```

## 📖 Documentação (OBRIGATÓRIO)

### Swagger/OpenAPI

- **Todos** os endpoints devem ter documentação Swagger
- **Todas** as responses devem ter exemplos
- **Todos** os DTOs devem ter descrições

```typescript
// ✅ CORRETO
@ApiProperty({
  description: 'Email do usuário',
  example: 'joao@exemplo.com',
  format: 'email',
})
@IsEmail()
email: string;
```

### JSDoc para Métodos Complexos

```typescript
/**
 * Cria um novo usuário no sistema
 * @param dto - Dados do usuário a ser criado
 * @returns Promise<UserEntity> - Usuário criado
 * @throws EmailAlreadyExistsException - Quando email já existe
 * @throws InvalidPasswordException - Quando senha é inválida
 */
async execute(dto: CreateUserDto): Promise<UserEntity> {
  // implementação
}
```

## ✅ Checklist Final

Antes de submeter sua contribuição, verifique:

### Código
- [ ] Segue a estrutura de pastas obrigatória
- [ ] Nomenclatura está correta
- [ ] Imports usam @ para paths internos
- [ ] DTOs têm validações adequadas
- [ ] Controllers têm documentação Swagger
- [ ] Use cases têm tratamento de erro
- [ ] Código está formatado (`npm run format`)
- [ ] Não há erros de lint (`npm run lint`)

### Documentação
- [ ] Endpoints têm documentação Swagger completa
- [ ] README foi atualizado se necessário
- [ ] Métodos complexos têm JSDoc

### Git
- [ ] Commits seguem o padrão estabelecido
- [ ] Branch está atualizada com main
- [ ] PR tem título e descrição clara
- [ ] Todos os itens do template de PR foram preenchidos

## 🆘 Precisa de Ajuda?

- **Issues**: Abra uma issue no GitHub
- **Discussões**: Use as discussões do repositório para dúvidas gerais
- **Code Review**: Peça review para colegas da equipe

---

## 🎓 Lembrete Acadêmico

Este projeto é desenvolvido no contexto acadêmico da Uniasselvi. Cada contribuição é uma oportunidade de aprendizado. Não hesite em:

- Fazer perguntas
- Sugerir melhorias
- Compartilhar conhecimento
- Colaborar com os colegas

**Juntos construímos um projeto melhor e aprendemos mais!**

---

<div align="center">
  <p>📚 Desenvolvido com propósito educacional pelos alunos da Uniasselvi</p>
</div>