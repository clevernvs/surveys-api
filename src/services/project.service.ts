export class ProjectService {
    async findAll() {
        return [
            {
                id: 1,
                title: 'Titulo do Projeto 01',
                description: 'Esse é a descrição do projeto.',
                type_id: 3,
                language_id: 1,
                category_id: 2,
                sample_source_id: 2,
                community_id: 2,
                status: 'ACTIVE',
                sample_size: 500,
                start_date: '2025-06-07',
                end_date: '2025-06-30',
                created_at: '2025-06-01',
                updated_at: '2025-06-02'
            },
            {
                id: 2,
                title: 'Titulo do Projeto 02',
                description: 'Esse é a descrição do projeto.',
                type_id: 5,
                language_id: 1,
                category_id: 3,
                sample_source_id: 2,
                community_id: 2,
                status: 'ACTIVE',
                sample_size: 1000,
                start_date: '2025-06-07',
                end_date: '2025-06-30',
                created_at: '2025-06-01',
                updated_at: '2025-06-02'
            },
        ];
    }

    async create(data: any) {
        // Simulação de criação (em produção, salvaria no banco)
        return {
            id: Math.floor(Math.random() * 10000),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    async update(id: number, data: any) {
        // Simulação de atualização (em produção, atualizaria no banco)
        return {
            id,
            ...data,
            updated_at: new Date().toISOString()
        };
    }

    async findById(id: number) {
        // Simulação de busca por ID (em produção, buscaria no banco)
        const projects = await this.findAll();
        return projects.find(project => project.id === id) || null;
    }

    async delete(id: number) {
        // Simulação de exclusão (em produção, deletaria do banco)
        return { success: true, message: `Projeto ${id} deletado com sucesso` };
    }
}