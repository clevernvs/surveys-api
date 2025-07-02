import { z } from 'zod';

// Schema base para projeto
export const ProjectSchema = z.object({
    title: z.string()
        .min(1, 'Título é obrigatório')
        .max(255, 'Título deve ter no máximo 255 caracteres'),

    description: z.string()
        .min(1, 'Descrição é obrigatória')
        .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),

    project_type_id: z.number()
        .int('ID do tipo de projeto deve ser um número inteiro')
        .positive('ID do tipo de projeto deve ser positivo'),

    language_id: z.number()
        .int('ID do idioma deve ser um número inteiro')
        .positive('ID do idioma deve ser positivo'),

    category_id: z.number()
        .int('ID da categoria deve ser um número inteiro')
        .positive('ID da categoria deve ser positivo'),

    sample_source_id: z.number()
        .int('ID da fonte da amostra deve ser um número inteiro')
        .positive('ID da fonte da amostra deve ser positivo'),

    community_id: z.number()
        .int('ID da comunidade deve ser um número inteiro')
        .positive('ID da comunidade deve ser positivo'),

    status: z.boolean({
        required_error: 'Status é obrigatório',
        invalid_type_error: 'Status deve ser um booleano'
    }),

    sample_size: z.number()
        .int('Tamanho da amostra deve ser um número inteiro')
        .min(1, 'Tamanho da amostra deve ser pelo menos 1')
        .max(100000, 'Tamanho da amostra deve ser no máximo 100.000'),

    start_date: z.string()
        .min(1, 'Data de início é obrigatória')
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, 'Data de início deve ser uma data válida (YYYY-MM-DD)'),

    end_date: z.string()
        .min(1, 'Data de fim é obrigatória')
        .refine((date) => {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        }, 'Data de fim deve ser uma data válida (YYYY-MM-DD)'),

    company_id: z.number()
        .int('ID da empresa deve ser um número inteiro')
        .positive('ID da empresa deve ser positivo')
});

// Schema para criação de projeto (com validação de datas)
export const CreateProjectSchema = ProjectSchema.refine(
    (data) => {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        return endDate > startDate;
    },
    {
        message: 'Data de fim deve ser posterior à data de início',
        path: ['end_date']
    }
);

// Schema para atualização de projeto (campos opcionais)
export const UpdateProjectSchema = ProjectSchema.partial().refine(
    (data) => {
        if (data.start_date && data.end_date) {
            const startDate = new Date(data.start_date);
            const endDate = new Date(data.end_date);
            return endDate > startDate;
        }
        return true;
    },
    {
        message: 'Data de fim deve ser posterior à data de início',
        path: ['end_date']
    }
);

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