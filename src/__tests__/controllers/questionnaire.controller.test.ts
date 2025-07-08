import { Request, Response } from 'express';
import {
    getAllQuestionnaires,
    getQuestionnaireById,
    createQuestionnaire,
    updateQuestionnaire,
    deleteQuestionnaire
} from '../../controllers/questionnaire.controller';

// Mock do QuestionnaireService
jest.mock('../../services/questionnaire.service');

// Mock da instância do service
const mockQuestionnaireServiceInstance = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mocked(require('../../services/questionnaire.service').QuestionnaireService).mockImplementation(() => mockQuestionnaireServiceInstance);

describe('QuestionnaireController', () => {
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

    describe('getAllQuestionnaires', () => {
        it('deve retornar todos os questionários com sucesso', async () => {
            const mockQuestionnaires = [
                {
                    id: 1,
                    title: 'Questionário A',
                    project_id: 1,
                    project: { id: 1, title: 'Projeto A' },
                    sample_source: { id: 1, name: 'Fonte A' },
                    filters: []
                },
                {
                    id: 2,
                    title: 'Questionário B',
                    project_id: 2,
                    project: { id: 2, title: 'Projeto B' },
                    sample_source: { id: 1, name: 'Fonte A' },
                    filters: []
                }
            ];

            mockQuestionnaireServiceInstance.findAll.mockResolvedValue(mockQuestionnaires);

            await getAllQuestionnaires(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockQuestionnaires,
                message: 'Questionários encontrados com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockQuestionnaireServiceInstance.findAll.mockRejectedValue(error);

            await getAllQuestionnaires(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao buscar questionários',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('getQuestionnaireById', () => {
        it('deve retornar questionário por ID com sucesso', async () => {
            const mockQuestionnaire = {
                id: 1,
                title: 'Questionário A',
                project_id: 1,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };

            mockRequest.params = { id: '1' };

            mockQuestionnaireServiceInstance.findById.mockResolvedValue(mockQuestionnaire);

            await getQuestionnaireById(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockQuestionnaire,
                message: 'Questionário encontrado com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            mockRequest.params = { id: 'abc' };

            await getQuestionnaireById(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findById).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            mockRequest.params = { id: '999' };

            const error = new Error('Questionário não encontrado');
            mockQuestionnaireServiceInstance.findById.mockRejectedValue(error);

            await getQuestionnaireById(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockRequest.params = { id: '1' };

            mockQuestionnaireServiceInstance.findById.mockRejectedValue(error);

            await getQuestionnaireById(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao buscar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('createQuestionnaire', () => {
        it('deve criar questionário com sucesso', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            const mockCreatedQuestionnaire = {
                id: 1,
                ...questionnaireData,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31')
            };

            mockRequest.body = questionnaireData;

            mockQuestionnaireServiceInstance.create.mockResolvedValue(mockCreatedQuestionnaire);

            await createQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.create).toHaveBeenCalledWith(questionnaireData);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockCreatedQuestionnaire,
                message: 'Questionário criado com sucesso'
            });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 999,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            mockRequest.body = questionnaireData;

            const error = new Error('Projeto não encontrado');
            mockQuestionnaireServiceInstance.create.mockRejectedValue(error);

            await createQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.create).toHaveBeenCalledWith(questionnaireData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Projeto não encontrado',
                message: 'O projeto especificado não existe'
            });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            mockRequest.body = questionnaireData;

            const error = new Error('Erro de banco de dados');
            mockQuestionnaireServiceInstance.create.mockRejectedValue(error);

            await createQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.create).toHaveBeenCalledWith(questionnaireData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao criar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('updateQuestionnaire', () => {
        it('deve atualizar questionário com sucesso', async () => {
            const updateData = {
                title: 'Questionário Atualizado',
                goal: 200
            };

            const mockUpdatedQuestionnaire = {
                id: 1,
                ...updateData,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            mockQuestionnaireServiceInstance.update.mockResolvedValue(mockUpdatedQuestionnaire);

            await updateQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockUpdatedQuestionnaire,
                message: 'Questionário atualizado com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const updateData = {
                title: 'Questionário Atualizado'
            };

            mockRequest.params = { id: 'abc' };
            mockRequest.body = updateData;

            await updateQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.update).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            const updateData = {
                title: 'Questionário Atualizado'
            };

            mockRequest.params = { id: '999' };
            mockRequest.body = updateData;

            const error = new Error('Questionário não encontrado');
            mockQuestionnaireServiceInstance.update.mockRejectedValue(error);

            await updateQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.update).toHaveBeenCalledWith(999, updateData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            const updateData = {
                title: 'Questionário Atualizado',
                project_id: 999
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            const error = new Error('Projeto não encontrado');
            mockQuestionnaireServiceInstance.update.mockRejectedValue(error);

            await updateQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Projeto não encontrado',
                message: 'O projeto especificado não existe'
            });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            const updateData = {
                title: 'Questionário Atualizado'
            };

            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;

            const error = new Error('Erro de banco de dados');
            mockQuestionnaireServiceInstance.update.mockRejectedValue(error);

            await updateQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao atualizar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('deleteQuestionnaire', () => {
        it('deve deletar questionário com sucesso', async () => {
            const deleteResult = { message: 'Questionário deletado com sucesso' };

            mockRequest.params = { id: '1' };

            mockQuestionnaireServiceInstance.delete.mockResolvedValue(deleteResult);

            await deleteQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                message: 'Questionário deletado com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            mockRequest.params = { id: 'abc' };

            await deleteQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.delete).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            mockRequest.params = { id: '999' };

            const error = new Error('Questionário não encontrado');
            mockQuestionnaireServiceInstance.delete.mockRejectedValue(error);

            await deleteQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.delete).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            mockRequest.params = { id: '1' };

            const error = new Error('Erro de banco de dados');
            mockQuestionnaireServiceInstance.delete.mockRejectedValue(error);

            await deleteQuestionnaire(mockRequest as Request, mockResponse as Response);

            expect(mockQuestionnaireServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao deletar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });
}); 