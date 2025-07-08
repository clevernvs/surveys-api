import request from 'supertest';
import express from 'express';

// Mock do ClientService
const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../../services/client.service', () => ({
    ClientService: jest.fn().mockImplementation(() => mockService),
}));

// Mock do middleware de validação
jest.mock('../../middleware/zod-validation.middleware', () => ({
    validateZod: jest.fn(() => (req: any, res: any, next: any) => next()),
    validateParams: jest.fn(() => (req: any, res: any, next: any) => next()),
}));

import clientRoutes from '../../routes/client.routes';

const app = express();
app.use(express.json());
app.use('/api/v2', clientRoutes);

describe('Client Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/v2/clients', () => {
        it('deve retornar todos os clientes', async () => {
            const mockClients = [
                { id: 1, name: 'Cliente A', email: 'clientea@test.com' },
                { id: 2, name: 'Cliente B', email: 'clienteb@test.com' }
            ];
            mockService.findAll.mockResolvedValue(mockClients);

            const response = await request(app)
                .get('/api/v2/clients')
                .expect(200);

            expect(mockService.findAll).toHaveBeenCalledTimes(1);
            expect(response.body).toEqual(mockClients);
        });

        it('deve retornar erro 500 quando service falhar', async () => {
            mockService.findAll.mockRejectedValue(new Error('Erro interno'));

            const response = await request(app)
                .get('/api/v2/clients')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar clientes' });
        });
    });

    describe('GET /api/v2/clients/:id', () => {
        it('deve retornar cliente por ID', async () => {
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            mockService.findById.mockResolvedValue(mockClient);

            const response = await request(app)
                .get('/api/v2/clients/1')
                .expect(200);

            expect(mockService.findById).toHaveBeenCalledWith(1);
            expect(response.body).toEqual(mockClient);
        });

        it('deve retornar 404 quando cliente não encontrado', async () => {
            mockService.findById.mockResolvedValue(null);

            const response = await request(app)
                .get('/api/v2/clients/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Cliente não encontrado' });
        });
    });

    describe('POST /api/v2/clients', () => {
        it('deve criar cliente com sucesso', async () => {
            const clientData = { name: 'Novo Cliente', email: 'novo@test.com' };
            const mockCreatedClient = { id: 1, ...clientData };
            mockService.create.mockResolvedValue(mockCreatedClient);

            const response = await request(app)
                .post('/api/v2/clients')
                .send(clientData)
                .expect(201);

            expect(mockService.create).toHaveBeenCalledWith(clientData);
            expect(response.body).toEqual(mockCreatedClient);
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const clientData = { name: '', email: 'invalido' };
            mockService.create.mockRejectedValue(new Error('Nome é obrigatório'));

            const response = await request(app)
                .post('/api/v2/clients')
                .send(clientData)
                .expect(400);

            expect(response.body).toEqual({ error: 'Nome é obrigatório' });
        });

        it('deve retornar erro 409 para email duplicado', async () => {
            const clientData = { name: 'Cliente', email: 'existente@test.com' };
            mockService.create.mockRejectedValue(new Error('Já existe um cliente com esse email'));

            const response = await request(app)
                .post('/api/v2/clients')
                .send(clientData)
                .expect(409);

            expect(response.body).toEqual({ error: 'Já existe um cliente com esse email' });
        });
    });

    describe('PUT /api/v2/clients/:id', () => {
        it('deve atualizar cliente com sucesso', async () => {
            const updateData = { name: 'Cliente Atualizado' };
            const mockUpdatedClient = { id: 1, name: 'Cliente Atualizado', email: 'test@test.com' };
            mockService.update.mockResolvedValue(mockUpdatedClient);

            const response = await request(app)
                .put('/api/v2/clients/1')
                .send(updateData)
                .expect(200);

            expect(mockService.update).toHaveBeenCalledWith(1, updateData);
            expect(response.body).toEqual(mockUpdatedClient);
        });

        it('deve retornar 404 quando cliente não encontrado', async () => {
            const updateData = { name: 'Cliente Atualizado' };
            mockService.update.mockRejectedValue(new Error('Cliente não encontrado'));

            const response = await request(app)
                .put('/api/v2/clients/999')
                .send(updateData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Cliente não encontrado' });
        });
    });

    describe('DELETE /api/v2/clients/:id', () => {
        it('deve deletar cliente com sucesso', async () => {
            const mockResult = {
                success: true,
                message: 'Cliente "Cliente Teste" (ID: 1) deletado com sucesso'
            };
            mockService.delete.mockResolvedValue(mockResult);

            const response = await request(app)
                .delete('/api/v2/clients/1')
                .expect(200);

            expect(mockService.delete).toHaveBeenCalledWith(1);
            expect(response.body).toEqual(mockResult);
        });

        it('deve retornar 404 quando cliente não encontrado', async () => {
            mockService.delete.mockRejectedValue(new Error('Cliente não encontrado'));

            const response = await request(app)
                .delete('/api/v2/clients/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Cliente não encontrado' });
        });

        it('deve retornar 409 quando cliente possui projetos relacionados', async () => {
            mockService.delete.mockRejectedValue(new Error('Não é possível deletar o cliente pois possui projetos relacionados'));

            const response = await request(app)
                .delete('/api/v2/clients/1')
                .expect(409);

            expect(response.body).toEqual({ error: 'Não é possível deletar o cliente pois possui projetos relacionados' });
        });
    });
}); 