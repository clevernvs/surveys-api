export class AnswerService {
    async findAll() {
        return [
            {
                id: 1,
                title: 'Titulo da Resposta 01',
                question_id: 1,
                numeric_order: 3,
                is_fixed: true,
                jump_to_question_id: 1,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 2,
                title: 'Titulo da Resposta 02',
                question_type_id: 1,
                numeric_order: 4,
                is_fixed: false,
                jump_to_question_id: null,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 3,
                title: 'Titulo da Resposta 03',
                question_type_id: 1,
                numeric_order: 2,
                is_fixed: false,
                jump_to_question_id: null,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 4,
                title: 'Titulo da Resposta 04',
                question_type_id: 1,
                numeric_order: 1,
                is_fixed: false,
                jump_to_question_id: null,
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },

        ];
    }
}