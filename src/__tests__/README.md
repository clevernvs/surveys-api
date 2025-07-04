# Testes da API de Surveys

Este diretório contém todos os testes da aplicação, organizados por tipo e funcionalidade.

## Estrutura dos Testes

```
src/__tests__/
├── setup.ts                    # Configuração global dos testes
├── mocks/                      # Mocks compartilhados
│   └── prisma.mock.ts         # Mock do Prisma Client
├── services/                   # Testes unitários dos serviços
│   └── company.service.test.ts
├── controllers/                # Testes unitários dos controllers
│   └── company.controller.test.ts
├── integration/                # Testes de integração
│   └── company.routes.test.ts
└── schemas/                    # Testes dos schemas de validação
    └── company.schema.test.ts
```

## Tipos de Teste

### 1. Testes Unitários (Services)
- Testam a lógica de negócio isoladamente
- Usam mocks para dependências externas (Prisma)
- Cobrem todos os métodos dos serviços
- Testam casos de sucesso e erro

### 2. Testes Unitários (Controllers)
- Testam a lógica dos controllers
- Mockam os serviços
- Verificam respostas HTTP corretas
- Testam tratamento de erros

### 3. Testes de Integração (Routes)
- Testam os endpoints completos
- Usam supertest para simular requisições HTTP
- Mockam apenas o banco de dados
- Verificam validação de entrada e saída

### 4. Testes de Schemas
- Testam validação de dados com Zod
- Verificam regras de negócio nos schemas
- Testam casos válidos e inválidos

## Executando os Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Executar testes em CI
npm run test:ci
```

## Cobertura de Testes

Os testes cobrem:

### Company Service (100%)
- ✅ `findAll()` - Buscar todas as empresas
- ✅ `findById()` - Buscar empresa por ID
- ✅ `create()` - Criar nova empresa
- ✅ `update()` - Atualizar empresa existente
- ✅ `delete()` - Deletar empresa

### Company Controller (100%)
- ✅ `getAllCompanies()` - GET /companies
- ✅ `getCompanyById()` - GET /companies/:id
- ✅ `createCompany()` - POST /companies
- ✅ `updateCompany()` - PUT /companies/:id
- ✅ `deleteCompany()` - DELETE /companies/:id

### Company Schemas (100%)
- ✅ `CompanySchema` - Validação básica
- ✅ `CreateCompanySchema` - Validação para criação
- ✅ `UpdateCompanySchema` - Validação para atualização
- ✅ `CompanyIdSchema` - Validação de ID

### Company Routes (100%)
- ✅ GET /api/companies
- ✅ GET /api/companies/:id
- ✅ POST /api/companies
- ✅ PUT /api/companies/:id
- ✅ DELETE /api/companies/:id

## Casos de Teste Cobertos

### Cenários de Sucesso
- Criação, leitura, atualização e exclusão de empresas
- Validação de dados de entrada
- Respostas HTTP corretas

### Cenários de Erro
- Dados inválidos
- Recursos não encontrados
- Erros de banco de dados
- Conflitos de integridade
- Validação de schemas

### Casos Especiais
- Empresas com projetos relacionados (não podem ser deletadas)
- Nomes duplicados
- IDs inválidos
- Dados malformados

## Próximos Passos

1. Implementar testes para outros módulos:
   - Project
   - Questionnaire
   - Question
   - Answer

2. Adicionar testes E2E com banco de dados real

3. Configurar testes de performance

4. Implementar testes de segurança

## Boas Práticas Seguidas

- ✅ Isolamento de testes
- ✅ Mocks apropriados
- ✅ Nomes descritivos
- ✅ Cobertura completa
- ✅ Testes de casos de erro
- ✅ Organização clara
- ✅ Documentação 