import { z } from 'zod';

const QuestionnaireStatusEnum = z.enum([
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELLED'
]);

export const QuestionnaireSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    project_id: z.number({ required_error: 'O projeto é obrigatório' }),
    sample_source_id: z.number({ required_error: 'A fonte da amostra é obrigatória' }),
    goal: z.number({ required_error: 'A meta é obrigatória' }),
    filter_id: z.number({ required_error: 'O filtro é obrigatório' }),
    randomized_questions: z.boolean().default(false),
    status: QuestionnaireStatusEnum.default('DRAFT'),
    start_date: z.string().min(1, 'Data de início é obrigatória'),
    end_date: z.string().min(1, 'Data de fim é obrigatória')
}).refine((data) => {
    const startDate = new Date(data.start_date);
    const endDate = new Date(data.end_date);
    return endDate > startDate;
}, {
    message: 'Data de fim deve ser posterior à data de início',
    path: ['end_date']
});

export const CreateQuestionnaireSchema = QuestionnaireSchema;
export const UpdateQuestionnaireSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório').optional(),
    project_id: z.number({ required_error: 'O projeto é obrigatório' }).optional(),
    sample_source_id: z.number({ required_error: 'A fonte da amostra é obrigatória' }).optional(),
    goal: z.number({ required_error: 'A meta é obrigatória' }).optional(),
    filter_id: z.number({ required_error: 'O filtro é obrigatório' }).optional(),
    randomized_questions: z.boolean().optional(),
    status: QuestionnaireStatusEnum.optional(),
    start_date: z.string().min(1, 'Data de início é obrigatória').optional(),
    end_date: z.string().min(1, 'Data de fim é obrigatória').optional()
});

export type CreateQuestionnaireInput = z.infer<typeof CreateQuestionnaireSchema>;
export type UpdateQuestionnaireInput = z.infer<typeof UpdateQuestionnaireSchema>; 