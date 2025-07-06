import { z } from 'zod';

const AnswerTypeEnum = z.enum([
    'TEXT',
    'NUMBER',
    'DATE',
    'BOOLEAN',
    'MULTIPLE_CHOICE',
    'SINGLE_CHOICE',
    'RATING',
    'GRID_COLUMN',
    'GRID_ROW'
]);

export const CreateAnswerSchema = z.object({
    question_id: z.number({ required_error: 'O ID da pergunta é obrigatório' }),
    answer_type: AnswerTypeEnum.default('TEXT'),
    value: z.string().min(1, 'O valor é obrigatório'),
    fixed: z.boolean().default(false),
    order_index: z.number({ required_error: 'A ordem é obrigatória' }),
    skip_to_question_id: z.number().nullable().optional(),
});

export const UpdateAnswerSchema = CreateAnswerSchema.partial();

export type CreateAnswerInput = z.infer<typeof CreateAnswerSchema>;
export type UpdateAnswerInput = z.infer<typeof UpdateAnswerSchema>; 