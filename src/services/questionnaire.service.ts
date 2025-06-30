export class QuestionnaireService {
    async findAll() {
        return [
            {
                id: 1,
                title: 'Titulo do Questionario 01',
                project_id: 1,
                is_randomized_answers: true,
                filter_id: null,
                status: 'active',
                created_at: '2025-06-01',
                updated_at: '2025-08-01'
            },
        ];
    }
}