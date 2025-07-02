# Validação com Zod

Esta API utiliza a biblioteca [Zod](https://zod.dev/) para validação de dados de entrada, oferecendo validação robusta e tipagem TypeScript automática.

## Funcionalidades

### Validações Implementadas
- ✅ **Campos obrigatórios** - Validação automática de campos requeridos
- ✅ **Tipos de dados** - Validação de string, number, boolean, date
- ✅ **Ranges e limites** - Validação de comprimento, valores mínimos/máximos
- ✅ **Validações customizadas** - Regras de negócio específicas (ex: datas)
- ✅ **Transformação automática** - Conversão de tipos quando necessário
- ✅ **Mensagens de erro personalizadas** - Erros claros e específicos

### Schemas Disponíveis

#### Projetos (`src/schemas/project.schema.ts`)
- `ProjectSchema` - Schema base para projetos
- `CreateProjectSchema` - Validação para criação (com validação de datas)
- `UpdateProjectSchema` - Validação para atualização (campos opcionais)
- `ProjectIdSchema` - Validação de ID de projeto

#### Empresas (`src/schemas/company.schema.ts`)
- `CompanySchema` - Schema base para empresas
- `CreateCompanySchema` - Validação para criação
- `UpdateCompanySchema` - Validação para atualização
- `CompanyIdSchema` - Validação de ID de empresa

## Como Usar

### 1. Nas Rotas (Automático)

```typescript
import { validateZod, validateParams } from '../middleware/zod-validation.middleware';
import { CreateProjectSchema, ProjectIdSchema } from '../schemas/project.schema';

// Validação automática de body e params
router.post('/projects', validateZod(CreateProjectSchema), createProject);
router.get('/projects/:id', validateParams(ProjectIdSchema), getProjectById);
```

### 2. Validação Manual

```typescript
import { CreateProjectSchema } from '../schemas/project.schema';

// Validar dados manualmente
const result = CreateProjectSchema.safeParse(data);
if (!result.success) {
    console.log('Erros:', result.error.errors);
} else {
    // Dados válidos em result.data
    const validatedData = result.data;
}
```

### 3. Tipos TypeScript

```typescript
import { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema';

// Tipos automáticos derivados dos schemas
function createProject(data: CreateProjectInput) {
    // data já está tipado e validado
}
```

## Exemplos de Validação

### Validação de Projeto

```typescript
const projectData = {
    title: "Projeto Teste",
    description: "Descrição do projeto",
    project_type_id: 1,
    language_id: 1,
    category_id: 1,
    sample_source_id: 1,
    community_id: 1,
    status: false,
    sample_size: 500,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    company_id: 1
};

// Validação automática via middleware
const response = await fetch('/api/v2/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projectData)
});
```

### Resposta de Erro

```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "field": "title",
      "message": "Título é obrigatório"
    },
    {
      "field": "status",
      "message": "Status deve ser um booleano"
    },
    {
      "field": "end_date",
      "message": "Data de fim deve ser posterior à data de início"
    }
  ]
}
```

## Validações Específicas

### Projetos
- **Título**: String obrigatória, 1-255 caracteres
- **Descrição**: String obrigatória, 1-1000 caracteres
- **IDs**: Números inteiros positivos
- **Status**: Boolean obrigatório
- **Sample Size**: Número inteiro entre 1-100.000
- **Datas**: Strings no formato YYYY-MM-DD, data de fim > data de início

### Empresas
- **Nome**: String obrigatória, 1-255 caracteres, trim automático

### IDs
- **Formato**: String que pode ser convertida para número inteiro positivo

## Vantagens do Zod

1. **🔒 Type Safety** - Validação em runtime com tipagem TypeScript
2. **📝 Declarativo** - Schemas legíveis e expressivos
3. **⚡ Performance** - Validação rápida e eficiente
4. **🛠️ Extensível** - Fácil adicionar validações customizadas
5. **🔄 Transformação** - Conversão automática de tipos
6. **📋 Mensagens** - Erros claros e personalizáveis
7. **🧪 Testável** - Fácil testar validações isoladamente

## Middleware Disponíveis

- `validateZod(schema)` - Valida body da requisição
- `validateParams(schema)` - Valida parâmetros de rota
- `validateQuery(schema)` - Valida query parameters
- `validateRequest(options)` - Valida múltiplos aspectos da requisição

## Adicionando Novos Schemas

1. Crie um novo arquivo em `src/schemas/`
2. Defina o schema usando Zod
3. Exporte os tipos TypeScript
4. Use o middleware nas rotas

```typescript
// src/schemas/example.schema.ts
import { z } from 'zod';

export const ExampleSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido')
});

export type ExampleInput = z.infer<typeof ExampleSchema>;
``` 