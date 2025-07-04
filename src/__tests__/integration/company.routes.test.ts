import request from 'supertest';
import express from 'express';
import companyRoutes from '../../routes/company.routes';
import { CompanyService } from '../../services/company.service';

// Mock do CompanyService
jest.mock('../../services/company.service');

const mockCompanyService = CompanyService as jest.MockedClass<typeof CompanyService>;

describe('Company Routes Integration Tests', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/', companyRoutes);

        // Reset dos mocks
        jest.clearAllMocks();

        // Mock das instâncias do service
        mockCompanyService.prototype.findAll = jest.fn();
        mockCompanyService.prototype.findById = jest.fn();
        mockCompanyService.prototype.create = jest.fn();
        mockCompanyService.prototype.update = jest.fn();
        mockCompanyService.prototype.delete = jest.fn();
    });

    describe('GET /api/companies', () => {
        it('deve retornar todas as empresas com sucesso', async () => {
            const mockCompanies = [
                { id: 1, name: 'Empresa A' },
                { id: 2, name: 'Empresa B' },
            ];

            const mockFindAll = jest.fn().mockResolvedValue(mockCompanies);
            mockCompanyService.prototype.findAll = mockFindAll;

            const response = await request(app)
                .get('/companies')
                .expect(200);

            expect(response.body).toEqual(mockCompanies);
            expect(mockFindAll).toHaveBeenCalledTimes(1);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockFindAll = jest.fn().mockRejectedValue(new Error('Erro de banco'));
            mockCompanyService.prototype.findAll = mockFindAll;

            const response = await request(app)
                .get('/companies')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar empresas' });
            expect(mockFindAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('GET /api/companies/:id', () => {
        it('deve retornar empresa quando encontrada', async () => {
            const mockCompany = { id: 1, name: 'Empresa A' };
            const mockFindById = jest.fn().mockResolvedValue(mockCompany);
            mockCompanyService.prototype.findById = mockFindById;

            const response = await request(app)
                .get('/companies/1')
                .expect(200);

            expect(response.body).toEqual(mockCompany);
            expect(mockFindById).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const mockFindById = jest.fn().mockResolvedValue(null);
            mockCompanyService.prototype.findById = mockFindById;

            const response = await request(app)
                .get('/companies/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockFindById).toHaveBeenCalledWith(999);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockFindById = jest.fn().mockRejectedValue(new Error('Erro de banco'));
            mockCompanyService.prototype.findById = mockFindById;

            const response = await request(app)
                .get('/companies/1')
                .expect(500);

            expect(response.body).toEqual({ error: 'Erro ao buscar empresa' });
            expect(mockFindById).toHaveBeenCalledWith(1);
        });
    });

    describe('POST /api/companies', () => {
        it('deve criar empresa com sucesso', async () => {
            const companyData = { name: 'Nova Empresa' };
            const mockCreatedCompany = { id: 1, name: 'Nova Empresa' };
            const mockCreate = jest.fn().mockResolvedValue(mockCreatedCompany);
            mockCompanyService.prototype.create = mockCreate;

            const response = await request(app)
                .post('/companies')
                .send(companyData)
                .expect(201);

            expect(response.body).toEqual(mockCreatedCompany);
            expect(mockCreate).toHaveBeenCalledWith(companyData);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Nova Empresa' };
            const error = new Error('Erro de validação');
            const mockCreate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.create = mockCreate;

            const response = await request(app)
                .post('/companies')
                .send(companyData)
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao criar empresa',
                details: 'Erro de validação',
            });
            expect(mockCreate).toHaveBeenCalledWith(companyData);
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const invalidData = { name: '' };

            const response = await request(app)
                .post('/companies')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Nome é obrigatório');
        });
    });

    describe('PUT /api/companies/:id', () => {
        it('deve atualizar empresa com sucesso', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const mockUpdatedCompany = { id: 1, name: 'Empresa Atualizada' };
            const mockUpdate = jest.fn().mockResolvedValue(mockUpdatedCompany);
            mockCompanyService.prototype.update = mockUpdate;

            const response = await request(app)
                .put('/companies/1')
                .send(companyData)
                .expect(200);

            expect(response.body).toEqual(mockUpdatedCompany);
            expect(mockUpdate).toHaveBeenCalledWith(1, companyData);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Empresa não encontrada');
            const mockUpdate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.update = mockUpdate;

            const response = await request(app)
                .put('/companies/999')
                .send(companyData)
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockUpdate).toHaveBeenCalledWith(999, companyData);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Erro de banco');
            const mockUpdate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.update = mockUpdate;

            const response = await request(app)
                .put('/companies/1')
                .send(companyData)
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao atualizar empresa',
                details: 'Erro de banco',
            });
            expect(mockUpdate).toHaveBeenCalledWith(1, companyData);
        });

        it('deve retornar erro 400 quando dados inválidos', async () => {
            const invalidData = { name: '' };

            const response = await request(app)
                .put('/companies/1')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toContain('Nome é obrigatório');
        });
    });

    describe('DELETE /api/companies/:id', () => {
        it('deve deletar empresa com sucesso', async () => {
            const mockDelete = jest.fn().mockResolvedValue({
                success: true,
                message: 'Empresa deletada com sucesso',
            });
            mockCompanyService.prototype.delete = mockDelete;

            await request(app)
                .delete('/companies/1')
                .expect(204);

            expect(mockDelete).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const error = new Error('Empresa não encontrada');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            const response = await request(app)
                .delete('/companies/999')
                .expect(404);

            expect(response.body).toEqual({ error: 'Empresa não encontrada' });
            expect(mockDelete).toHaveBeenCalledWith(999);
        });

        it('deve retornar erro 400 quando empresa tem projetos relacionados', async () => {
            const error = new Error('Não é possível deletar a empresa pois possui projetos relacionados');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            const response = await request(app)
                .delete('/companies/1')
                .expect(400);

            expect(response.body).toEqual({
                error: 'Não é possível deletar a empresa pois possui projetos relacionados'
            });
            expect(mockDelete).toHaveBeenCalledWith(1);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            const response = await request(app)
                .delete('/companies/1')
                .expect(500);

            expect(response.body).toEqual({
                error: 'Erro ao deletar empresa',
                details: 'Erro de banco',
            });
            expect(mockDelete).toHaveBeenCalledWith(1);
        });
    });
}); 