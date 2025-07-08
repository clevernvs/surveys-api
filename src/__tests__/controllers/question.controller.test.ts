import { Request, Response } from 'express';

// Mock do service antes de importar o controller
const mockQuestionServiceInstance = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../services/question.service', () => ({
    QuestionService: jest.fn().mockImplementation(() => mockQuestionServiceInstance)
}));

import {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion
} from '../../controllers/question.controller';

describe('QuestionController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;
    let mockSend: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();
        mockSend = jest.fn().mockReturnThis();
        mockRequest = {};
        mockResponse = { json: mockJson, status: mockStatus, send: mockSend };
        jest.clearAllMocks();
    });

    describe('getAllQuestions', () => {
        it('deve retornar todas as questões', async () => {
            const mockQuestions = [{ id: 1, title: 'Q1' }, { id: 2, title: 'Q2' }];
            mockQuestionServiceInstance.findAll.mockResolvedValue(mockQuestions);
            await getAllQuestions(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockQuestions,
                message: 'Questões encontradas com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockQuestionServiceInstance.findAll.mockRejectedValue(new Error('DB error'));
            await getAllQuestions(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao buscar questões',
                message: 'DB error'
            });
        });
    });

    describe('getQuestionById', () => {
        it('deve retornar questão por ID', async () => {
            const mockQuestion = { id: 1, title: 'Q1' };
            mockRequest.params = { id: '1' };
            mockQuestionServiceInstance.findById.mockResolvedValue(mockQuestion);
            await getQuestionById(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockQuestion,
                message: 'Questão encontrada com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            mockRequest.params = { id: 'abc' };
            await getQuestionById(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.findById).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 404 se não encontrar', async () => {
            mockRequest.params = { id: '999' };
            mockQuestionServiceInstance.findById.mockRejectedValue(new Error('Questão não encontrada'));
            await getQuestionById(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.findById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockRequest.params = { id: '1' };
            mockQuestionServiceInstance.findById.mockRejectedValue(new Error('DB error'));
            await getQuestionById(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao buscar questão',
                message: 'DB error'
            });
        });
    });

    describe('createQuestion', () => {
        it('deve criar questão com sucesso', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 1 };
            const mockCreated = { id: 1, ...data };
            mockRequest.body = data;
            mockQuestionServiceInstance.create.mockResolvedValue(mockCreated);
            await createQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.create).toHaveBeenCalledWith(data);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockCreated,
                message: 'Questão criada com sucesso'
            });
        });
        it('deve retornar erro 404 se questionário não encontrado', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 999 };
            mockRequest.body = data;
            mockQuestionServiceInstance.create.mockRejectedValue(new Error('Questionário não encontrado'));
            await createQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 1 };
            mockRequest.body = data;
            mockQuestionServiceInstance.create.mockRejectedValue(new Error('DB error'));
            await createQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao criar questão',
                message: 'DB error'
            });
        });
    });

    describe('updateQuestion', () => {
        it('deve atualizar questão com sucesso', async () => {
            const updateData = { title: 'Q Editada' };
            const mockUpdated = { id: 1, ...updateData };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            mockQuestionServiceInstance.update.mockResolvedValue(mockUpdated);
            await updateQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockUpdated,
                message: 'Questão atualizada com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            mockRequest.params = { id: 'abc' };
            mockRequest.body = { title: 'Q Editada' };
            await updateQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.update).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 404 se questão não encontrada', async () => {
            mockRequest.params = { id: '999' };
            mockRequest.body = { title: 'Q Editada' };
            mockQuestionServiceInstance.update.mockRejectedValue(new Error('Questão não encontrada'));
            await updateQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 404 se questionário não encontrado', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { questionnaire_id: 999 };
            mockQuestionServiceInstance.update.mockRejectedValue(new Error('Questionário não encontrado'));
            await updateQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { title: 'Q Editada' };
            mockQuestionServiceInstance.update.mockRejectedValue(new Error('DB error'));
            await updateQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao atualizar questão',
                message: 'DB error'
            });
        });
    });

    describe('deleteQuestion', () => {
        it('deve deletar questão com sucesso', async () => {
            mockRequest.params = { id: '1' };
            const mockResult = { message: 'Questão excluída com sucesso' };
            mockQuestionServiceInstance.delete.mockResolvedValue(mockResult);
            await deleteQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith({
                success: true,
                data: mockResult,
                message: 'Questão excluída com sucesso'
            });
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            mockRequest.params = { id: 'abc' };
            await deleteQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockQuestionServiceInstance.delete).not.toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 404 se questão não encontrada', async () => {
            mockRequest.params = { id: '999' };
            mockQuestionServiceInstance.delete.mockRejectedValue(new Error('Questão não encontrada'));
            await deleteQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockRequest.params = { id: '1' };
            mockQuestionServiceInstance.delete.mockRejectedValue(new Error('DB error'));
            await deleteQuestion(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                success: false,
                error: 'Erro interno do servidor ao excluir questão',
                message: 'DB error'
            });
        });
    });
}); 