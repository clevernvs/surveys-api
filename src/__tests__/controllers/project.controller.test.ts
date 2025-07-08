import { Request, Response } from 'express';

// Mock do service antes de importar o controller
const mockProjectServiceInstance = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../services/project.service', () => ({
    ProjectService: jest.fn().mockImplementation(() => mockProjectServiceInstance)
}));

import {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} from '../../controllers/project.controller';

describe('ProjectController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();

        mockRequest = {};
        mockResponse = {
            json: mockJson,
            status: mockStatus
        };

        // Limpar todos os mocks
        jest.clearAllMocks();
    });

    describe('getAllProjects', () => {
        it('deve retornar todos os projetos com sucesso', async () => {
            const mockProjects = [
                {
                    id: 1,
                    title: 'Projeto A',
                    description: 'Descrição do projeto A',
                    client_id: 1,
                    client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' }
                },
                {
                    id: 2,
                    title: 'Projeto B',
                    description: 'Descrição do projeto B',
                    client_id: 2,
                    client: { id: 2, name: 'Cliente B', email: 'clienteb@test.com' }
                }
            ];

            mockProjectServiceInstance.findAll.mockResolvedValue(mockProjects);

            await getAllProjects(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith(mockProjects);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockProjectServiceInstance.findAll.mockRejectedValue(error);

            await getAllProjects(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar projetos' });
        });
    });

    describe('getProjectById', () => {
        it('deve retornar projeto por ID com sucesso', async () => {
            const mockProject = {
                id: 1,
                title: 'Projeto A',
                description: 'Descrição do projeto A',
                client_id: 1,
                client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' }
            };

            mockRequest.params = { id: '1' };

            mockProjectServiceInstance.findById.mockResolvedValue(mockProject);

            await getProjectById(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith(mockProject);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockRequest.params = { id: '999' };

            mockProjectServiceInstance.findById.mockResolvedValue(null);

            await getProjectById(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.findById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockRequest.params = { id: '1' };

            mockProjectServiceInstance.findById.mockRejectedValue(error);

            await getProjectById(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar projeto' });
        });
    });

    describe('createProject', () => {
        it('deve criar projeto com sucesso', async () => {
            const projectData = {
                title: 'Novo Projeto',
                description: 'Descrição do novo projeto',
                client_id: 1,
                language_id: 1,
                community_id: 1,
                sample_size: 100
            };

            const mockCreatedProject = {
                id: 1,
                ...projectData,
                client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' }
            };

            mockRequest.body = projectData;

            mockProjectServiceInstance.create.mockResolvedValue(mockCreatedProject);

            await createProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.create).toHaveBeenCalledWith(projectData);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedProject);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const projectData = {
                title: '',
                description: 'Descrição do projeto',
                client_id: 1
            };

            mockRequest.body = projectData;

            const error = new Error('Título, descrição e client_id são obrigatórios');
            mockProjectServiceInstance.create.mockRejectedValue(error);

            await createProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.create).toHaveBeenCalledWith(projectData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao criar projeto',
                details: 'Título, descrição e client_id são obrigatórios'
            });
        });

        it('deve retornar erro 404 quando cliente não encontrado', async () => {
            const projectData = {
                title: 'Novo Projeto',
                description: 'Descrição do projeto',
                client_id: 999
            };

            mockRequest.body = projectData;

            const error = new Error('Cliente não encontrado');
            mockProjectServiceInstance.create.mockRejectedValue(error);

            await createProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.create).toHaveBeenCalledWith(projectData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao criar projeto',
                details: 'Cliente não encontrado'
            });
        });

        it('deve retornar erro 409 quando dados duplicados', async () => {
            const projectData = {
                title: 'Projeto Existente',
                description: 'Descrição do projeto',
                client_id: 1
            };

            mockRequest.body = projectData;

            const error = new Error('Já existe um projeto com esses dados');
            mockProjectServiceInstance.create.mockRejectedValue(error);

            await createProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.create).toHaveBeenCalledWith(projectData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao criar projeto',
                details: 'Já existe um projeto com esses dados'
            });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const projectData = {
                title: 'Novo Projeto',
                description: 'Descrição do projeto',
                client_id: 1
            };

            mockRequest.body = projectData;

            const error = new Error('Erro de banco de dados');
            mockProjectServiceInstance.create.mockRejectedValue(error);

            await createProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.create).toHaveBeenCalledWith(projectData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao criar projeto',
                details: 'Erro de banco de dados'
            });
        });
    });

    describe('updateProject', () => {
        it('deve atualizar projeto com sucesso', async () => {
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };

            const mockUpdatedProject = {
                id: 1,
                ...updateData,
                client: { id: 1, name: 'Cliente A', email: 'clientea@test.com' }
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            mockProjectServiceInstance.update.mockResolvedValue(mockUpdatedProject);

            await updateProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedProject);
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };

            mockRequest.params = { id: '999' };
            mockRequest.body = updateData;

            const error = new Error('Projeto não encontrado');
            mockProjectServiceInstance.update.mockRejectedValue(error);

            await updateProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.update).toHaveBeenCalledWith(999, updateData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const updateData = {
                title: '',
                description: 'Descrição atualizada',
                client_id: 1
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            const error = new Error('Título, descrição e client_id são obrigatórios');
            mockProjectServiceInstance.update.mockRejectedValue(error);

            await updateProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao atualizar projeto',
                details: 'Título, descrição e client_id são obrigatórios'
            });
        });

        it('deve retornar erro 404 quando cliente não encontrado', async () => {
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 999
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            const error = new Error('Cliente não encontrado');
            mockProjectServiceInstance.update.mockRejectedValue(error);

            await updateProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Cliente não encontrado' });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const updateData = {
                title: 'Projeto Atualizado',
                description: 'Descrição atualizada',
                client_id: 1
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            const error = new Error('Erro de banco de dados');
            mockProjectServiceInstance.update.mockRejectedValue(error);

            await updateProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao atualizar projeto',
                details: 'Erro de banco de dados'
            });
        });
    });

    describe('deleteProject', () => {
        it('deve deletar projeto com sucesso', async () => {
            const deleteResult = {
                success: true,
                message: 'Projeto "Projeto para Deletar" (ID: 1) deletado com sucesso'
            };

            mockRequest.params = { id: '1' };

            mockProjectServiceInstance.delete.mockResolvedValue(deleteResult);

            await deleteProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockJson).not.toHaveBeenCalled();
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockRequest.params = { id: '999' };

            const error = new Error('Projeto não encontrado');
            mockProjectServiceInstance.delete.mockRejectedValue(error);

            await deleteProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.delete).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Projeto não encontrado' });
        });

        it('deve retornar erro 400 quando projeto possui relacionamentos', async () => {
            mockRequest.params = { id: '1' };

            const error = new Error('Não é possível deletar o projeto pois possui relacionamentos ativos');
            mockProjectServiceInstance.delete.mockRejectedValue(error);

            await deleteProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Não é possível deletar o projeto pois possui relacionamentos ativos' });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            mockRequest.params = { id: '1' };

            const error = new Error('Erro de banco de dados');
            mockProjectServiceInstance.delete.mockRejectedValue(error);

            await deleteProject(mockRequest as Request, mockResponse as Response);

            expect(mockProjectServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao deletar projeto',
                details: 'Erro de banco de dados'
            });
        });
    });
}); 