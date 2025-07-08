import { mockPrisma } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import request from 'supertest';
import app from '../../app';

describe('Project Routes', () => {
    beforeEach(() => {
        // Limpar todos os mocks antes de cada teste
        Object.values(mockPrisma.client).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockClear();
            }
        });
        Object.values(mockPrisma.project).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockClear();
            }
        });
    });

    describe('GET /projects', () => {
        it('deve retornar todos os projetos', async () => {
            const mockProjects = [
                {
                    id: 1,
                    title: 'Projeto A',
                    description: 'Descrição do projeto A',
                    client_id: 1,
                    client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' },
                    language: { id: 1, name: 'Português' },
                    community: { id: 1, name: 'Comunidade A' },
                    SampleSource: null
                },
                {
                    id: 2,
                    title: 'Projeto B',
                    description: 'Descrição do projeto B',
                    client_id: 2,
                    client: { id: 2, name: 'Cliente B', email: 'clienteb@test.com' },
                    language: { id: 1, name: 'Português' },
                    community: { id: 1, name: 'Comunidade A' },
                    SampleSource: null
                }
            ];

            mockPrisma.project.findMany.mockResolvedValue(mockProjects);

            const response = await request(app)
                .get('/api/v2/projects')
                .expect(200);

            expect(response.body).toEqual(mockProjects);
            expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.project.findMany.mockRejectedValue(error);

            const response = await request(app)
                .get('/api/v2/projects')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar projetos' });
        });
    });

    describe('GET /projects/:id', () => {
        it('deve retornar projeto por ID', async () => {
            const mockProject = {
                id: 1,
                title: 'Projeto A',
                description: 'Descrição do projeto A',
                client_id: 1,
                client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' },
                language: { id: 1, name: 'Português' },
                community: { id: 1, name: 'Comunidade A' },
                SampleSource: null
            };

            mockPrisma.project.findUnique.mockResolvedValue(mockProject);

            const response = await request(app)
                .get('/api/v2/projects/1')
                .expect(200);

            expect(response.body).toEqual(mockProject);
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/v2/projects/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .get('/api/v2/projects/abc')
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando ID negativo', async () => {
            const response = await request(app)
                .get('/api/v2/projects/-1')
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.project.findUnique.mockRejectedValue(error);

            const response = await request(app)
                .get('/api/v2/projects/1')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar projeto' });
        });
    });

    describe('POST /projects', () => {
        const validProjectData = {
            title: 'Novo Projeto',
            description: 'Descrição do novo projeto',
            client_id: 1,
            language_id: 1,
            community_id: 1,
            sample_size: 100
        };

        it('deve criar projeto com sucesso', async () => {
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const mockCreatedProject = {
                id: 1,
                ...validProjectData,
                client: mockClient,
                language: { id: 1, name: 'Português' },
                community: { id: 1, name: 'Comunidade A' },
                SampleSource: null
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

            const response = await request(app)
                .post('/api/v2/projects')
                .send(validProjectData)
                .expect(200);

            expect(response.body).toEqual(mockCreatedProject);
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.project.create).toHaveBeenCalledWith({
                data: {
                    title: 'Novo Projeto',
                    description: 'Descrição do novo projeto',
                    project_type: 'OTHER',
                    language_id: 1,
                    category: 'OTHER',
                    sample_source_id: undefined,
                    community_id: 1,
                    status: 'DRAFT',
                    sample_size: 100,
                    client_id: 1
                },
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
        });

        it('deve retornar erro 400 quando título estiver vazio', async () => {
            const invalidData = { ...validProjectData, title: '' };

            const response = await request(app)
                .post('/api/v2/projects')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando descrição estiver vazia', async () => {
            const invalidData = { ...validProjectData, description: '' };

            const response = await request(app)
                .post('/api/v2/projects')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando client_id não for fornecido', async () => {
            const { client_id, ...invalidData } = validProjectData;

            const response = await request(app)
                .post('/api/v2/projects')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando language_id for inválido', async () => {
            const invalidData = { ...validProjectData, language_id: -1 };

            const response = await request(app)
                .post('/api/v2/projects')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando sample_size for inválido', async () => {
            const invalidData = { ...validProjectData, sample_size: 0 };

            const response = await request(app)
                .post('/api/v2/projects')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 404 quando cliente não encontrado', async () => {
            mockPrisma.client.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/v2/projects')
                .send(validProjectData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Cliente não encontrado' });
        });

        it('deve retornar erro 409 quando dados duplicados', async () => {
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockRejectedValue(error);

            const response = await request(app)
                .post('/api/v2/projects')
                .send(validProjectData)
                .expect(409);

            expect(response.body).toEqual({ error: 'Já existe um projeto com esses dados' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockRejectedValue(error);

            const response = await request(app)
                .post('/api/v2/projects')
                .send(validProjectData)
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro de banco de dados' });
        });
    });

    describe('PUT /projects/:id', () => {
        const validUpdateData = {
            title: 'Projeto Atualizado',
            description: 'Descrição atualizada',
            client_id: 1
        };

        it('deve atualizar projeto com sucesso', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const mockUpdatedProject = {
                id: 1,
                ...validUpdateData,
                client: mockClient,
                language: { id: 1, name: 'Português' },
                community: { id: 1, name: 'Comunidade A' },
                SampleSource: null
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.update.mockResolvedValue(mockUpdatedProject);

            const response = await request(app)
                .put('/api/v2/projects/1')
                .send(validUpdateData)
                .expect(200);

            expect(response.body).toEqual(mockUpdatedProject);
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.project.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Projeto Atualizado',
                    description: 'Descrição atualizada',
                    project_type: undefined,
                    language_id: undefined,
                    category: undefined,
                    sample_source_id: undefined,
                    community_id: undefined,
                    status: undefined,
                    sample_size: undefined,
                    client_id: 1
                },
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/v2/projects/999')
                .send(validUpdateData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .put('/api/v2/projects/abc')
                .send(validUpdateData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando título estiver vazio', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const invalidData = { ...validUpdateData, title: '' };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);

            const response = await request(app)
                .put('/api/v2/projects/1')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 404 quando cliente não encontrado', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .put('/api/v2/projects/1')
                .send(validUpdateData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Cliente não encontrado' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.update.mockRejectedValue(error);

            const response = await request(app)
                .put('/api/v2/projects/1')
                .send(validUpdateData)
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro de banco de dados' });
        });
    });

    describe('DELETE /projects/:id', () => {
        it('deve deletar projeto com sucesso', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockResolvedValue(existingProject);

            const response = await request(app)
                .delete('/api/v2/projects/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Projeto "Projeto para Deletar" (ID: 1) deletado com sucesso'
            });
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .delete('/api/v2/projects/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .delete('/api/v2/projects/abc')
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 409 quando projeto possui relacionamentos', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const error = new Error('Foreign key constraint failed');
            (error as any).code = 'P2003';

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/api/v2/projects/1')
                .expect(409);

            expect(response.body).toEqual({ error: 'Não é possível deletar o projeto pois possui relacionamentos ativos' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/api/v2/projects/1')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro de banco de dados' });
        });
    });
}); 