import { z } from 'zod';

export const CreateFilterSchema = z.object({
    questionnaire_id: z.number({ required_error: 'O ID do questionário é obrigatório' }),
    gender_id: z.number({ required_error: 'O ID do gênero é obrigatório' }),
    social_class_id: z.number({ required_error: 'O ID da classe social é obrigatório' }),
    age_range_id: z.number({ required_error: 'O ID da faixa etária é obrigatório' }),
    country_id: z.number({ required_error: 'O ID do país é obrigatório' }),
    city_id: z.number({ required_error: 'O ID da cidade é obrigatório' }),
    state_id: z.number({ required_error: 'O ID do estado é obrigatório' }),
    quota_id: z.number({ required_error: 'O ID da quota é obrigatório' }),
});

export const UpdateFilterSchema = CreateFilterSchema.partial();

export type CreateFilterInput = z.infer<typeof CreateFilterSchema>;
export type UpdateFilterInput = z.infer<typeof UpdateFilterSchema>; 