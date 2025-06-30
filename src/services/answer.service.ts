export class AnswerService {
    async findAll() {
        return [
            {
                id: 1,
                title: 'Titulo da Pergunta 01',
                question_id: 1,
                is_randomized_answers: false,
                is_required: true,
                filter_id: 1,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 2,
                title: 'Titulo da Pergunta 02',
                question_type_id: 1,
                is_randomized_answers: true,
                is_required: true,
                filter_id: 2,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 3,
                title: 'Titulo da Pergunta 03',
                question_type_id: 1,
                is_randomized_answers: false,
                is_required: true,
                filter_id: null,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },

        ];
    }
}