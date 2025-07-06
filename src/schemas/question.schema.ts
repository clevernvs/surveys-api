import { z } from 'zod';

const QuestionTypeEnum = z.enum([
    'TEXT',
    'OPEN_ANSWER',
    'SINGLE_CHOICE',
    'MULTIPLE_CHOICE',
    'GRID',
    'RANKING',
    'NPS',
    'SYMBOL'
]);

export const CreateQuestionSchema = z.object({
    questionnaire_id: z.number({ required_error: 'O ID do questionário é obrigatório' }),
    question_type: QuestionTypeEnum.default('TEXT'),
    title: z.string().min(1, 'O título é obrigatório'),
    required: z.boolean().default(false),
    randomize_answers: z.boolean().default(false),
    order_index: z.number({ required_error: 'A ordem é obrigatória' }),
    kpi: z.string().optional(),
    attributes: z.string().optional(),
    brand: z.string().optional(),
    product_brand: z.string().optional(),
});

export const UpdateQuestionSchema = CreateQuestionSchema.partial();

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>; 