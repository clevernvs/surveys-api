import { z } from 'zod';

export const QuestionnaireSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    filter_id: z.number({ required_error: 'O filtro é obrigatório' }),
    randomized_answers: z.boolean().optional(),
    status_id: z.number({ required_error: 'O status é obrigatório' }),
    project_id: z.number({ required_error: 'O projeto é obrigatório' }),
});

export type QuestionnaireInput = z.infer<typeof QuestionnaireSchema>; 