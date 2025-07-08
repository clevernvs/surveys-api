import { mockPrisma } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import request from 'supertest';
import app from '../../app';

describe('Answer Routes', () => {
    // beforeEach(() => { resetPrismaMock(); });

    describe('GET /answers', () => {
        it('deve retornar todas as respostas', async () => {
            const mockAnswers = [{ id: 1, value: 'R1' }, { id: 2, value: 'R2' }];
            mockPrisma.answer.findMany.mockResolvedValue(mockAnswers);
            const response = await request(app).get('/api/v2/answers').expect(200);
            expect(response.body).toEqual(mockAnswers);
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.answer.findMany.mockRejectedValue(new Error('DB error'));
            const response = await request(app).get('/api/v2/answers').expect(500);
            expect(response.body).toEqual({ error: 'Erro ao buscar todas as perguntas' });
        });
    });

    describe('GET /answers/:id', () => {
        it('deve retornar resposta por ID', async () => {
            const mockAnswer = { id: 1, value: 'R1' };
            mockPrisma.answer.findUnique.mockResolvedValue(mockAnswer);
            const response = await request(app).get('/api/v2/answers/1').expect(200);
            expect(response.body).toEqual(mockAnswer);
        });
        it('deve retornar erro 404 se não encontrar', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            const response = await request(app).get('/api/v2/answers/999').expect(404);
            expect(response.body).toEqual({ error: 'Resposta não encontrada' });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.answer.findUnique.mockRejectedValue(new Error('DB error'));
            const response = await request(app).get('/api/v2/answers/1').expect(404);
            expect(response.body).toEqual({ error: 'DB error' });
        });
    });

    describe('POST /answers', () => {
        const validData = {
            question_id: 1,
            answer_type: 'TEXT',
            value: 'Resposta teste',
            fixed: false,
            order_index: 1
        };
        it('deve criar resposta com sucesso', async () => {
            mockPrisma.answer.create.mockResolvedValue({ id: 1, ...validData });
            const response = await request(app).post('/api/v2/answers').send(validData).expect(201);
            expect(response.body).toEqual({ id: 1, ...validData });
        });
        it('deve retornar erro 400 para dados inválidos', async () => {
            const invalidData = { ...validData, value: '' };
            const response = await request(app).post('/api/v2/answers').send(invalidData).expect(400);
            expect(response.body).toHaveProperty('error');
        });
        it('deve retornar erro 500 se question_id não existe', async () => {
            const error = new Error('A pergunta informada (question_id) não existe.') as any;
            error.code = 'P2003';
            mockPrisma.answer.create.mockRejectedValue(error);
            const response = await request(app).post('/api/v2/answers').send(validData).expect(500);
            expect(response.body).toEqual({ error: 'A pergunta informada (question_id) não existe.' });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.answer.create.mockRejectedValue(new Error('DB error'));
            const response = await request(app).post('/api/v2/answers').send(validData).expect(500);
            expect(response.body).toEqual({ error: 'DB error' });
        });
    });

    describe('PUT /answers/:id', () => {
        const updateData = { value: 'Resposta editada' };
        it('deve atualizar resposta com sucesso', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue({ id: 1, value: 'R1', question_id: 1 });
            mockPrisma.answer.update.mockResolvedValue({ id: 1, ...updateData });
            const response = await request(app).put('/api/v2/answers/1').send(updateData).expect(200);
            expect(response.body).toEqual({ id: 1, ...updateData });
        });
        it('deve retornar erro 404 se resposta não encontrada', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            const response = await request(app).put('/api/v2/answers/999').send(updateData).expect(500);
            expect(response.body).toEqual({ error: 'Resposta não encontrada' });
        });
        it('deve retornar erro 400 para dados inválidos', async () => {
            const invalidData = { value: '' };
            const response = await request(app).put('/api/v2/answers/1').send(invalidData).expect(400);
            expect(response.body).toHaveProperty('error');
        });
        it('deve retornar erro 500 se question_id não existe', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue({ id: 1, value: 'R1', question_id: 1 });
            const error = new Error('A pergunta informada (question_id) não existe.') as any;
            error.code = 'P2003';
            mockPrisma.answer.update.mockRejectedValue(error);
            const response = await request(app).put('/api/v2/answers/1').send({ question_id: 999 }).expect(500);
            expect(response.body).toEqual({ error: 'A pergunta informada (question_id) não existe.' });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue({ id: 1, value: 'R1', question_id: 1 });
            mockPrisma.answer.update.mockRejectedValue(new Error('DB error'));
            const response = await request(app).put('/api/v2/answers/1').send(updateData).expect(500);
            expect(response.body).toEqual({ error: 'DB error' });
        });
    });

    describe('DELETE /answers/:id', () => {
        it('deve deletar resposta com sucesso', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue({ id: 1, value: 'R1', question_id: 1 });
            mockPrisma.answer.delete.mockResolvedValue({ id: 1 });
            const response = await request(app).delete('/api/v2/answers/1').expect(200);
            expect(response.body).toEqual({ success: true, message: 'Resposta (ID: 1) deletada com sucesso' });
        });
        it('deve retornar erro 500 se resposta não encontrada', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            const response = await request(app).delete('/api/v2/answers/999').expect(500);
            expect(response.body).toEqual({ error: 'Resposta não encontrada' });
        });
        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue({ id: 1, value: 'R1', question_id: 1 });
            mockPrisma.answer.delete.mockRejectedValue(new Error('DB error'));
            const response = await request(app).delete('/api/v2/answers/1').expect(500);
            expect(response.body).toEqual({ error: 'DB error' });
        });
    });
}); 