export class QuestionService {
    async findAll() {
        return [
            {
                id: 1,
                title: 'Titulo da Pergunta 01',
                question_type_id: 1,
                questionnaire_id: 1,
                is_required: true,
                media: {
                    video: null,
                    image: null,
                },
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 1,
                title: 'Titulo da Pergunta 02',
                question_type_id: 2,
                questionnaire_id: 1,
                is_required: false,
                media: {
                    video: null,
                    image: null,
                },
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
            {
                id: 1,
                title: 'Titulo da Pergunta 03',
                question_type_id: 5,
                questionnaire_id: 1,
                is_required: false,
                media: {
                    video: null,
                    image: null,
                },
                created_at: '2025-06-01',
                updated_at: '2025-06-30',
            },
        ];
    }
}