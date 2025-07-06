import { z } from 'zod';

export const QuestionnaireSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    filter_id: z.number({ required_error: 'O filtro é obrigatório' }),
    randomized_answers: z.boolean().optional(),
    status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'], {
        required_error: 'O status é obrigatório',
        invalid_type_error: 'Status deve ser DRAFT, ACTIVE, PAUSED, COMPLETED ou CANCELLED'
    }),
    project_id: z.number({ required_error: 'O projeto é obrigatório' }),
});

export const CreateQuestionnaireSchema = QuestionnaireSchema;
export const UpdateQuestionnaireSchema = QuestionnaireSchema.partial();

export type CreateQuestionnaireInput = z.infer<typeof CreateQuestionnaireSchema>;
export type UpdateQuestionnaireInput = z.infer<typeof UpdateQuestionnaireSchema>; 