import { z } from 'zod';

// Schema para cliente
export const ClientSchema = z.object({
    name: z.string()
        .trim()
        .min(1, 'Nome é obrigatório')
        .max(255, 'Nome deve ter no máximo 255 caracteres'),
    email: z.string()
        .email('Email deve ser válido')
        .trim()
        .min(1, 'Email é obrigatório')
        .max(255, 'Email deve ter no máximo 255 caracteres')
});

// Schema para criação de cliente
export const CreateClientSchema = ClientSchema;

// Schema para atualização de cliente
export const UpdateClientSchema = ClientSchema.partial();

// Schema para ID de cliente
export const ClientIdSchema = z.object({
    id: z.string()
        .min(1, 'ID é obrigatório')
        .refine((id) => {
            const numId = Number(id);
            return !isNaN(numId) && numId > 0 && Number.isInteger(numId);
        }, 'ID deve ser um número inteiro positivo')
});

// Tipos TypeScript derivados dos schemas
export type CreateClientInput = z.infer<typeof CreateClientSchema>;
export type UpdateClientInput = z.infer<typeof UpdateClientSchema>;
export type ClientInput = z.infer<typeof ClientSchema>; 