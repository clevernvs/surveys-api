import { z } from 'zod';

// Schema para empresa
export const CompanySchema = z.object({
    name: z.string()
        .min(1, 'Nome é obrigatório')
        .max(255, 'Nome deve ter no máximo 255 caracteres')
        .trim()
});

// Schema para criação de empresa
export const CreateCompanySchema = CompanySchema;

// Schema para atualização de empresa
export const UpdateCompanySchema = CompanySchema.partial();

// Schema para ID de empresa
export const CompanyIdSchema = z.object({
    id: z.string()
        .min(1, 'ID é obrigatório')
        .refine((id) => {
            const numId = Number(id);
            return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
        }, 'ID deve ser um número inteiro positivo')
});

// Tipos TypeScript derivados dos schemas
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
export type CompanyInput = z.infer<typeof CompanySchema>; 