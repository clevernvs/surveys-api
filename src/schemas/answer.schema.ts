import { z } from 'zod';

export const CreateAnswerSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    question_id: z.number({ required_error: 'O ID da pergunta é obrigatório' }),
    fixed: z.boolean().optional(),
    numeric_order: z.number({ required_error: 'A ordem numérica é obrigatória' }),
    skip_to_question_id: z.number().nullable().optional(),
});

export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>; 