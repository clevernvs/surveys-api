import request from 'supertest';
import express from 'express';

// Mock do CompanyService
const mockService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

jest.mock('../../services/company.service', () => ({
    CompanyService: jest.fn().mockImplementation(() => mockService),
}));

import companyRoutes from '../../routes/company.routes';

describe('Company Routes Integration Tests', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', companyRoutes);

        // Reset dos mocks
        jest.clearAllMocks();
    });

    describe('GET /companies', () => {
        it('deve retornar todas as empresas com sucesso', async () => {
            const mockCompanies = [
                { id: 1, name: 'Empresa A' },
                { id: 2, name: 'Empresa B' },
            ];

            mockService.findAll.mockResolvedValue(mockCompanies);

            const response = await request(app)
                .get('/companies')
                .expect(200);

            expect(response.body).toEqual(mockCompanies);
            expect(mockService.findAll).toHaveBeenCalledTimes(1);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            mockService.findAll.mockRejectedValue(new Error('Erro de banco'));

            const response = await request(app)
                .get('/companies')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar empresas' });
            expect(mockService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /companies/:id', () => {
        it('deve retornar empresa quando encontrada', async () => {
            const mockCompany = { id: 1, name: 'Empresa A' };
            mockService.findById.mockResolvedValue(mockCompany);

            const response = await request(app)
                .get('/companies/1')
                .expect(200);

            expect(response.body).toEqual(mockCompany);
            expect(mockService.findById).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            mockService.findById.mockResolvedValue(null);

            const response = await request(app)
                .get('/companies/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockService.findById).toHaveBeenCalledWith(999);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            mockService.findById.mockRejectedValue(new Error('Erro de banco'));

            const response = await request(app)
                .get('/companies/1')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar empresa' });
            expect(mockService.findById).toHaveBeenCalledWith(1);
        });
    });

    describe('POST /companies', () => {
        it('deve criar empresa com sucesso', async () => {
            const companyData = { name: 'Nova Empresa' };
            const mockCreatedCompany = { id: 1, name: 'Nova Empresa' };
            mockService.create.mockResolvedValue(mockCreatedCompany);

            const response = await request(app)
                .post('/companies')
                .send(companyData)
                .expect(201);

            expect(response.body).toEqual(mockCreatedCompany);
            expect(mockService.create).toHaveBeenCalledWith(companyData);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Nova Empresa' };
            const error = new Error('Erro de validação');
            mockService.create.mockRejectedValue(error);

            const response = await request(app)
                .post('/companies')
                .send(companyData)
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao criar empresa',
                details: 'Erro de validação',
            });
            expect(mockService.create).toHaveBeenCalledWith(companyData);
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const invalidData = { name: '' };

            const response = await request(app)
                .post('/companies')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Dados inválidos');
        });
    });

    describe('PUT /companies/:id', () => {
        it('deve atualizar empresa com sucesso', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const mockUpdatedCompany = { id: 1, name: 'Empresa Atualizada' };
            mockService.update.mockResolvedValue(mockUpdatedCompany);

            const response = await request(app)
                .put('/companies/1')
                .send(companyData)
                .expect(200);

            expect(response.body).toEqual(mockUpdatedCompany);
            expect(mockService.update).toHaveBeenCalledWith(1, companyData);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Empresa não encontrada');
            mockService.update.mockRejectedValue(error);

            const response = await request(app)
                .put('/companies/999')
                .send(companyData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockService.update).toHaveBeenCalledWith(999, companyData);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Erro de banco');
            mockService.update.mockRejectedValue(error);

            const response = await request(app)
                .put('/companies/1')
                .send(companyData)
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao atualizar empresa',
                details: 'Erro de banco',
            });
            expect(mockService.update).toHaveBeenCalledWith(1, companyData);
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const invalidData = { name: '' };

            const response = await request(app)
                .put('/companies/1')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Dados inválidos');
        });
    });

    describe('DELETE /companies/:id', () => {
        it('deve deletar empresa com sucesso', async () => {
            mockService.delete.mockResolvedValue({
                success: true,
                message: 'Empresa deletada com sucesso',
            });

            await request(app)
                .delete('/companies/1')
                .expect(204);

            expect(mockService.delete).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const error = new Error('Empresa não encontrada');
            mockService.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/companies/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockService.delete).toHaveBeenCalledWith(999);
        });

        it('deve retornar erro 400 quando empresa tem projetos relacionados', async () => {
            const error = new Error('Não é possível deletar a empresa pois possui projetos relacionados');
            mockService.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/companies/1')
                .expect(400);

            expect(response.body).toEqual({
                error: 'Não é possível deletar a empresa pois possui projetos relacionados'
            });
            expect(mockService.delete).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco');
            mockService.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/companies/1')
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao deletar empresa',
                details: 'Erro de banco',
            });
            expect(mockService.delete).toHaveBeenCalledWith(1);
        });
    });
}); 