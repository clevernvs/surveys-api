import { z } from 'zod';

// Enums para validação
const ProjectTypeEnum = z.enum([
    'MARKET_RESEARCH',
    'CUSTOMER_SATISFACTION',
    'PRODUCT_DEVELOPMENT',
    'BRAND_AWARENESS',
    'USER_EXPERIENCE',
    'FEEDBACK_COLLECTION',
    'SURVEY_RESEARCH',
    'OTHER'
]);

const ProjectCategoryEnum = z.enum([
    'MARKET_RESEARCH',
    'CUSTOMER_SATISFACTION',
    'PRODUCT_DEVELOPMENT',
    'BRAND_AWARENESS',
    'USER_EXPERIENCE',
    'FEEDBACK_COLLECTION',
    'SURVEY_RESEARCH',
    'OTHER'
]);

const ProjectStatusEnum = z.enum([
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELLED'
]);

// Schema base para projeto
export const ProjectSchema = z.object({
    title: z.string()
        .min(1, 'Título é obrigatório')
        .max(255, 'Título deve ter no máximo 255 caracteres'),

    description: z.string()
        .min(1, 'Descrição é obrigatória')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),

    project_type: ProjectTypeEnum
        .default('OTHER'),

    language_id: z.number()
        .int('ID do idioma deve ser um número inteiro')
        .positive('ID do idioma deve ser positivo'),

    category: ProjectCategoryEnum
        .default('OTHER'),

    community_id: z.number()
        .int('ID da comunidade deve ser um número inteiro')
        .positive('ID da comunidade deve ser positivo'),

    sample_source_id: z.number()
        .int('ID da fonte da amostra deve ser um número inteiro')
        .positive('ID da fonte da amostra deve ser positivo')
        .optional(),

    status: ProjectStatusEnum
        .default('DRAFT'),

    sample_size: z.number()
        .int('Tamanho da amostra deve ser um número inteiro')
        .min(1, 'Tamanho da amostra deve ser pelo menos 1')
        .max(32767, 'Tamanho da amostra deve ser no máximo 32.767'),

    client_id: z.number()
        .int('ID do cliente deve ser um número inteiro')
        .positive('ID do cliente deve ser positivo')
});

// Schema para criação de projeto
export const CreateProjectSchema = ProjectSchema;

// Schema para atualização de projeto (campos opcionais)
export const UpdateProjectSchema = ProjectSchema.partial();

// Schema para ID de projeto
export const ProjectIdSchema = z.object({
    id: z.string()
        .min(1, 'ID é obrigatório')
        .refine((id) => {
            const numId = Number(id);
            return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
        }, 'ID deve ser um número inteiro positivo')
});

// Tipos TypeScript derivados dos schemas
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>;
export type ProjectInput = z.infer<typeof ProjectSchema>; 