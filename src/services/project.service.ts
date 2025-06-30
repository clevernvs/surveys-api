export class ProjectService {
    async findAll() {
        return [
            { id: 1, title: 'Titulo do Projeto 01', type: 'Redes Sociais', status: 'ACTIVE', created_at: '30/06/2025' },
            { id: 2, title: 'Titulo do Projeto 02', type: 'Comunidades', status: 'ACTIVE', created_at: '30/06/2025' },
            { id: 3, title: 'Titulo do Projeto 03', type: 'Redes Sociais', status: 'INACTIVE', created_at: '30/06/2025' },
        ];
    }
}