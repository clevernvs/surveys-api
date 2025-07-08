import { Request, Response } from 'express';

// Mock do service antes de importar o controller
const mockAnswerServiceInstance = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

jest.mock('../../services/answer.service', () => ({
    AnswerService: jest.fn().mockImplementation(() => mockAnswerServiceInstance)
}));

import {
    getAllAnswers,
    getAnswerById,
    createAnswer,
    updateAnswer,
    deleteAnswer
} from '../../controllers/answer.controller';

describe('AnswerController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn().mockReturnThis();
        mockStatus = jest.fn().mockReturnThis();
        mockRequest = {};
        mockResponse = { json: mockJson, status: mockStatus };
        jest.clearAllMocks();
    });

    describe('getAllAnswers', () => {
        it('deve retornar todas as respostas', async () => {
            const mockAnswers = [{ id: 1, value: 'R1' }, { id: 2, value: 'R2' }];
            mockAnswerServiceInstance.findAll.mockResolvedValue(mockAnswers);
            await getAllAnswers(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.findAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith(mockAnswers);
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockAnswerServiceInstance.findAll.mockRejectedValue(new Error('DB error'));
            await getAllAnswers(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar todas as perguntas' });
        });
    });

    describe('getAnswerById', () => {
        it('deve retornar resposta por ID', async () => {
            const mockAnswer = { id: 1, value: 'R1' };
            mockRequest.params = { id: '1' };
            mockAnswerServiceInstance.findById.mockResolvedValue(mockAnswer);
            await getAnswerById(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.findById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith(mockAnswer);
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 404 se não encontrar', async () => {
            mockRequest.params = { id: '999' };
            mockAnswerServiceInstance.findById.mockRejectedValue(new Error('Resposta não encontrada'));
            await getAnswerById(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.findById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Resposta não encontrada' });
        });
        it('deve retornar erro 404 com mensagem padrão', async () => {
            mockRequest.params = { id: '999' };
            mockAnswerServiceInstance.findById.mockRejectedValue(new Error('DB error'));
            await getAnswerById(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    describe('createAnswer', () => {
        it('deve criar resposta com sucesso', async () => {
            const data = { question_id: 1, value: 'Nova resposta' };
            const mockCreated = { id: 1, ...data };
            mockRequest.body = data;
            mockAnswerServiceInstance.create.mockResolvedValue(mockCreated);
            await createAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.create).toHaveBeenCalledWith(data);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreated);
        });
        it('deve retornar erro 500 com mensagem específica', async () => {
            const data = { question_id: 1, value: 'Nova resposta' };
            mockRequest.body = data;
            mockAnswerServiceInstance.create.mockRejectedValue(new Error('A pergunta informada (question_id) não existe.'));
            await createAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'A pergunta informada (question_id) não existe.' });
        });
        it('deve retornar erro 500 com mensagem padrão', async () => {
            const data = { question_id: 1, value: 'Nova resposta' };
            mockRequest.body = data;
            mockAnswerServiceInstance.create.mockRejectedValue(new Error('DB error'));
            await createAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    describe('updateAnswer', () => {
        it('deve atualizar resposta com sucesso', async () => {
            const updateData = { value: 'Resposta editada' };
            const mockUpdated = { id: 1, ...updateData };
            mockRequest.params = { id: '1' };
            mockRequest.body = updateData;
            mockAnswerServiceInstance.update.mockResolvedValue(mockUpdated);
            await updateAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.update).toHaveBeenCalledWith(1, updateData);
            expect(mockJson).toHaveBeenCalledWith(mockUpdated);
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 500 com mensagem específica', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { question_id: 999 };
            mockAnswerServiceInstance.update.mockRejectedValue(new Error('A pergunta informada (question_id) não existe.'));
            await updateAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'A pergunta informada (question_id) não existe.' });
        });
        it('deve retornar erro 500 com mensagem padrão', async () => {
            mockRequest.params = { id: '1' };
            mockRequest.body = { value: 'R' };
            mockAnswerServiceInstance.update.mockRejectedValue(new Error('DB error'));
            await updateAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });

    describe('deleteAnswer', () => {
        it('deve deletar resposta com sucesso', async () => {
            mockRequest.params = { id: '1' };
            const mockResult = { success: true, message: 'Resposta (ID: 1) deletada com sucesso' };
            mockAnswerServiceInstance.delete.mockResolvedValue(mockResult);
            await deleteAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockAnswerServiceInstance.delete).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith(mockResult);
            expect(mockStatus).not.toHaveBeenCalled();
        });
        it('deve retornar erro 500 com mensagem específica', async () => {
            mockRequest.params = { id: '999' };
            mockAnswerServiceInstance.delete.mockRejectedValue(new Error('Resposta não encontrada'));
            await deleteAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Resposta não encontrada' });
        });
        it('deve retornar erro 500 com mensagem padrão', async () => {
            mockRequest.params = { id: '1' };
            mockAnswerServiceInstance.delete.mockRejectedValue(new Error('DB error'));
            await deleteAnswer(mockRequest as Request, mockResponse as Response);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'DB error' });
        });
    });
}); 