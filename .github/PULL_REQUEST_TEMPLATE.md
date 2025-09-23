## 📋 Descrição
<!-- Descreva brevemente as alterações realizadas neste PR -->

## 🎯 Tipo de Mudança
<!-- Marque todas as opções que se aplicam -->
- [ ] 🐛 **Bug fix** - Correção de um problema existente
- [ ] ✨ **Nova funcionalidade** - Adição de nova feature
- [ ] 💥 **Breaking change** - Mudança que quebra compatibilidade
- [ ] 🔧 **Refatoração** - Melhoria do código sem alterar funcionalidade
- [ ] 📚 **Documentação** - Atualização ou adição de documentação
- [ ] 🧹 **Chore** - Tarefas de build, configuração, dependências
- [ ] 🧪 **Testes** - Adição ou correção de testes

## 🚀 Motivação e Contexto
<!-- Por que esta mudança é necessária? Que problema resolve? -->
<!-- Se corrige um issue, referencie aqui: "Fixes #123" -->

## 🧪 Como Testar
<!-- Descreva os passos para testar suas alterações -->
1. Clone a branch: `git checkout feature/sua-branch`
2. Instale as dependências: `npm install`
3. Configure o ambiente: `cp .env.example .env`
4. Execute a aplicação: `npm run start:dev`
5. Teste o endpoint/funcionalidade: [descreva aqui]

## 📸 Screenshots (se aplicável)
<!-- Cole aqui prints das alterações visuais ou da documentação Swagger -->

## ✅ Checklist (OBRIGATÓRIO)
<!-- Marque todos os itens antes de submeter o PR -->

### 📝 Código
- [ ] Código segue os padrões estabelecidos no [CONTRIBUTING.md](CONTRIBUTING.md)
- [ ] Nomenclatura está correta (PascalCase, camelCase, etc.)
- [ ] Imports usam `@/` para paths internos
- [ ] DTOs têm validações adequadas com class-validator
- [ ] Controllers têm documentação Swagger completa
- [ ] Use cases têm tratamento de erro apropriado
- [ ] Código passou no lint sem erros: `npm run lint`
- [ ] Código está formatado: `npm run format`

### 🏗️ Arquitetura
- [ ] Segue Clean Architecture (Use Cases, Repositories, DTOs)
- [ ] DTOs organizados corretamente (por use-case com shared para comuns)
- [ ] Entidades seguem o padrão estabelecido
- [ ] Exceções customizadas criadas quando necessário

### 📖 Documentação
- [ ] Todos os endpoints têm documentação Swagger
- [ ] DTOs têm `@ApiProperty` com descrições e exemplos
- [ ] README atualizado se necessário
- [ ] JSDoc adicionado para métodos complexos

### 🔄 Git
- [ ] Commits seguem o padrão: `tipo(escopo): descrição`
- [ ] Branch está atualizada com `main`: `git rebase main`
- [ ] Não há conflitos de merge
- [ ] Título do PR é descritivo e claro

### 🔍 Revisão
- [ ] PR tem título e descrição clara
- [ ] Código foi auto-revisado antes de submeter
- [ ] Funcionalidade testada manualmente
- [ ] Não quebra funcionalidades existentes

## 📚 Recursos Relacionados
<!-- Links para issues, documentação, referências -->
- Issue relacionado: #
- Documentação: 
- Referências: 

## 🤝 Reviewers Sugeridos
<!-- Tag colegas da equipe para review -->
@colega1 @colega2

---

### 📋 Para os Revisores
Por favor, verifiquem:
- [ ] Código segue os padrões do projeto
- [ ] Documentação Swagger está completa
- [ ] Funcionalidade funciona conforme esperado
- [ ] Não há problemas de segurança
- [ ] Performance está adequada

**Desenvolvido com ❤️ pelos alunos da Uniasselvi - Turmas EGS0011, EGS0016 e EGS0019**