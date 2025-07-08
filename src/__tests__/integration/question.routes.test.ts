import { mockPrisma } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import request from 'supertest';
import app from '../../app';

describe('Question Routes', () => {
    // beforeEach(() => { resetPrismaMock(); });

    describe('GET /questions', () => {
        it('deve retornar todas as questões', async () => {
            const mockQuestions = [{ id: 1, title: 'Q1' }, { id: 2, title: 'Q2' }];
            mockPrisma.question.findMany.mockResolvedValue(mockQuestions);
            const response = await request(app).get('/api/v2/questions').expect(200);
            expect(response.body).toEqual({
                success: true,
                data: mockQuestions,
                message: 'Questões encontradas com sucesso'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.question.findMany.mockRejectedValue(new Error('DB error'));
            const response = await request(app).get('/api/v2/questions').expect(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar questões',
                message: 'Erro interno do servidor'
            });
        });
    });

    describe('GET /questions/:id', () => {
        it('deve retornar questão por ID', async () => {
            const mockQuestion = { id: 1, title: 'Q1' };
            mockPrisma.question.findUnique.mockResolvedValue(mockQuestion);
            const response = await request(app).get('/api/v2/questions/1').expect(200);
            expect(response.body).toEqual({
                success: true,
                data: mockQuestion,
                message: 'Questão encontrada com sucesso'
            });
        });
        it('deve retornar erro 404 se não encontrar', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            const response = await request(app).get('/api/v2/questions/999').expect(404);
            expect(response.body).toEqual({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/questions/abc').expect(400);
            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.question.findUnique.mockRejectedValue(new Error('DB error'));
            const response = await request(app).get('/api/v2/questions/1').expect(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar questão',
                message: 'DB error'
            });
        });
    });

    describe('POST /questions', () => {
        const validData = {
            questionnaire_id: 1,
            question_type: 'TEXT',
            title: 'Pergunta teste',
            required: false,
            randomize_answers: false,
            order_index: 1
        };
        it('deve criar questão com sucesso', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue({ id: 1 });
            mockPrisma.question.create.mockResolvedValue({ id: 1, ...validData });
            const response = await request(app).post('/api/v2/questions').send(validData).expect(201);
            expect(response.body).toEqual({
                success: true,
                data: { id: 1, ...validData },
                message: 'Questão criada com sucesso'
            });
        });
        it('deve retornar erro 404 se questionário não encontrado', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);
            const response = await request(app).post('/api/v2/questions').send(validData).expect(404);
            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });
        it('deve retornar erro 400 para dados inválidos', async () => {
            const invalidData = { ...validData, title: '' };
            const response = await request(app).post('/api/v2/questions').send(invalidData).expect(400);
            expect(response.body).toHaveProperty('error');
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue({ id: 1 });
            mockPrisma.question.create.mockRejectedValue(new Error('DB error'));
            const response = await request(app).post('/api/v2/questions').send(validData).expect(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao criar questão',
                message: 'DB error'
            });
        });
    });

    describe('PUT /questions/:id', () => {
        const updateData = { title: 'Pergunta editada' };
        it('deve atualizar questão com sucesso', async () => {
            mockPrisma.question.findUnique.mockResolvedValue({ id: 1, title: 'Q1', questionnaire_id: 1 });
            mockPrisma.question.update.mockResolvedValue({ id: 1, ...updateData });
            const response = await request(app).put('/api/v2/questions/1').send(updateData).expect(200);
            expect(response.body).toEqual({
                success: true,
                data: { id: 1, ...updateData },
                message: 'Questão atualizada com sucesso'
            });
        });
        it('deve retornar erro 404 se questão não encontrada', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            const response = await request(app).put('/api/v2/questions/999').send(updateData).expect(404);
            expect(response.body).toEqual({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).put('/api/v2/questions/abc').send(updateData).expect(400);
            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 404 se questionário não encontrado', async () => {
            mockPrisma.question.findUnique.mockResolvedValue({ id: 1, title: 'Q1', questionnaire_id: 1 });
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);
            const response = await request(app).put('/api/v2/questions/1').send({ questionnaire_id: 999 }).expect(404);
            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.question.findUnique.mockResolvedValue({ id: 1, title: 'Q1', questionnaire_id: 1 });
            mockPrisma.question.update.mockRejectedValue(new Error('DB error'));
            const response = await request(app).put('/api/v2/questions/1').send(updateData).expect(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao atualizar questão',
                message: 'DB error'
            });
        });
    });

    describe('DELETE /questions/:id', () => {
        it('deve deletar questão com sucesso', async () => {
            mockPrisma.question.findUnique.mockResolvedValue({ id: 1, title: 'Q1', questionnaire_id: 1 });
            mockPrisma.question.delete.mockResolvedValue({ id: 1 });
            const response = await request(app).delete('/api/v2/questions/1').expect(200);
            expect(response.body).toEqual({
                success: true,
                data: { message: 'Questão excluída com sucesso' },
                message: 'Questão excluída com sucesso'
            });
        });
        it('deve retornar erro 404 se questão não encontrada', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            const response = await request(app).delete('/api/v2/questions/999').expect(404);
            expect(response.body).toEqual({
                success: false,
                error: 'Questão não encontrada',
                message: 'A questão especificada não existe'
            });
        });
        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).delete('/api/v2/questions/abc').expect(400);
            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.question.findUnique.mockResolvedValue({ id: 1, title: 'Q1', questionnaire_id: 1 });
            mockPrisma.question.delete.mockRejectedValue(new Error('DB error'));
            const response = await request(app).delete('/api/v2/questions/1').expect(500);
            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao excluir questão',
                message: 'DB error'
            });
        });
    });
}); 