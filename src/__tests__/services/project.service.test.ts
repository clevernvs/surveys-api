import { mockPrisma } from '../mocks/prisma.mock';
import { ProjectService } from '../../services/project.service';

// Mock do Prisma
jest.mock('../../prisma/client', () => mockPrisma);

describe('ProjectService', () => {
    let projectService: ProjectService;

    beforeEach(() => {
        projectService = new ProjectService();
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

    describe('findAll', () => {
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

            const result = await projectService.findAll();

            expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
            expect(result).toEqual(mockProjects);
        });

        it('deve lançar erro quando falhar ao buscar projetos', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.project.findMany.mockRejectedValue(error);

            await expect(projectService.findAll()).rejects.toThrow('Erro ao buscar projetos no banco de dados');
            expect(mockPrisma.project.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
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

            const result = await projectService.findById(1);

            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
            expect(result).toEqual(mockProject);
        });

        it('deve retornar null quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            const result = await projectService.findById(999);

            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
                include: {
                    client: true,
                    language: true,
                    community: true,
                    SampleSource: true
                }
            });
            expect(result).toBeNull();
        });

        it('deve lançar erro quando falhar ao buscar projeto', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.project.findUnique.mockRejectedValue(error);

            await expect(projectService.findById(1)).rejects.toThrow('Erro ao buscar projeto no banco de dados');
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
    });

    describe('create', () => {
        it('deve criar projeto com sucesso', async () => {
            const projectData = {
                title: 'Novo Projeto',
                description: 'Descrição do novo projeto',
                client_id: 1,
                language_id: 1,
                community_id: 1,
                sample_size: 100
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const mockCreatedProject = {
                id: 1,
                ...projectData,
                client: mockClient,
                language: { id: 1, name: 'Português' },
                community: { id: 1, name: 'Comunidade A' },
                SampleSource: null
            };

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockResolvedValue(mockCreatedProject);

            const result = await projectService.create(projectData);

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.project.create).toHaveBeenCalledWith({
                data: {
                    title: 'Novo Projeto',
                    description: 'Descrição do novo projeto',
                    project_type: undefined,
                    language_id: 1,
                    category: undefined,
                    sample_source_id: undefined,
                    community_id: 1,
                    status: undefined,
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
            expect(result).toEqual(mockCreatedProject);
        });

        it('deve lançar erro quando título estiver vazio', async () => {
            const projectData = {
                title: '',
                description: 'Descrição do projeto',
                client_id: 1
            };

            await expect(projectService.create(projectData)).rejects.toThrow('Título, descrição e client_id são obrigatórios');
            expect(mockPrisma.project.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando descrição estiver vazia', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: '',
                client_id: 1
            };

            await expect(projectService.create(projectData)).rejects.toThrow('Título, descrição e client_id são obrigatórios');
            expect(mockPrisma.project.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando client_id não for fornecido', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto'
            };

            await expect(projectService.create(projectData)).rejects.toThrow('Título, descrição e client_id são obrigatórios');
            expect(mockPrisma.project.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando cliente não encontrado', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto',
                client_id: 999
            };

            mockPrisma.client.findUnique.mockResolvedValue(null);

            await expect(projectService.create(projectData)).rejects.toThrow('Cliente não encontrado');
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.project.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando dados duplicados', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockRejectedValue(error);

            await expect(projectService.create(projectData)).rejects.toThrow('Já existe um projeto com esses dados');
            expect(mockPrisma.project.create).toHaveBeenCalled();
        });

        it('deve lançar erro quando referência inválida', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Foreign key constraint failed');
            (error as any).code = 'P2003';

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockRejectedValue(error);

            await expect(projectService.create(projectData)).rejects.toThrow('Referência inválida (foreign key constraint)');
            expect(mockPrisma.project.create).toHaveBeenCalled();
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const projectData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.create.mockRejectedValue(error);

            await expect(projectService.create(projectData)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.project.create).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('deve atualizar projeto com sucesso', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const mockUpdatedProject = {
                id: 1,
                ...updateData,
                client: mockClient,
                language: { id: 1, name: 'Português' },
                community: { id: 1, name: 'Comunidade A' },
                SampleSource: null
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.update.mockResolvedValue(mockUpdatedProject);

            const result = await projectService.update(1, updateData);

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
            expect(result).toEqual(mockUpdatedProject);
        });

        it('deve lançar erro quando projeto não encontrado', async () => {
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };

            mockPrisma.project.findUnique.mockResolvedValue(null);

            await expect(projectService.update(999, updateData)).rejects.toThrow('Projeto não encontrado');
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.project.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando título estiver vazio', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const updateData = {
                title: '',
                description: 'Descrição atualizada',
                client_id: 1
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);

            await expect(projectService.update(1, updateData)).rejects.toThrow('Título, descrição e client_id são obrigatórios');
            expect(mockPrisma.project.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando cliente não encontrado', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 999
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(null);

            await expect(projectService.update(1, updateData)).rejects.toThrow('Cliente não encontrado');
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.project.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando projeto não encontrado na atualização', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto Antigo',
                description: 'Descrição antiga',
                client_id: 1
            };
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.client.findUnique.mockResolvedValue(mockClient);
            mockPrisma.project.update.mockRejectedValue(error);

            await expect(projectService.update(1, updateData)).rejects.toThrow('Projeto não encontrado');
        });
    });

    describe('delete', () => {
        it('deve deletar projeto com sucesso', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockResolvedValue(existingProject);

            const result = await projectService.delete(1);

            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.project.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                success: true,
                message: 'Projeto "Projeto para Deletar" (ID: 1) deletado com sucesso'
            });
        });

        it('deve lançar erro quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            await expect(projectService.delete(999)).rejects.toThrow('Projeto não encontrado');
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.project.delete).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando projeto não encontrado na exclusão', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockRejectedValue(error);

            await expect(projectService.delete(1)).rejects.toThrow('Projeto não encontrado');
        });

        it('deve lançar erro quando projeto possui relacionamentos ativos', async () => {
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

            await expect(projectService.delete(1)).rejects.toThrow('Não é possível deletar o projeto pois possui relacionamentos ativos');
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const existingProject = {
                id: 1,
                title: 'Projeto para Deletar',
                description: 'Descrição do projeto',
                client_id: 1
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.project.findUnique.mockResolvedValue(existingProject);
            mockPrisma.project.delete.mockRejectedValue(error);

            await expect(projectService.delete(1)).rejects.toThrow('Erro de banco de dados');
        });
    });
}); 