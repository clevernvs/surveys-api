export class QuestionnaireService {
    async findAll() {
        return [
            { id: 1, title: 'Titulo do Questionario 01', project_id: 1, type: 'Redes Sociais', status: 'ACTIVE', created_at: '2025-06-01', updated_at: '2025-08-01' },
            { id: 2, title: 'Titulo do Questionario 02', project_id: 2, type: 'Comunidades', status: 'ACTIVE', created_at: '2025-06-01', updated_at: '2025-08-01' },
            { id: 3, title: 'Titulo do Questionario 03', project_id: 1, type: 'Redes Sociais', status: 'INACTIVE', created_at: '2025-06-01', updated_at: '2025-08-01' },
        ];
    }
}