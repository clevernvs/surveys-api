import { Request, Response } from 'express';
import { CompanyService } from '../../services/company.service';
import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from '../../controllers/company.controller';

// Mock do CompanyService
jest.mock('../../services/company.service');

const mockCompanyService = CompanyService as jest.MockedClass<typeof CompanyService>;

describe('CompanyController', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockResponse = {
            json: mockJson,
            status: mockStatus,
            send: jest.fn(),
        };

        // Reset dos mocks
        jest.clearAllMocks();

        // Mock das instâncias do service
        mockCompanyService.prototype.findAll = jest.fn();
        mockCompanyService.prototype.findById = jest.fn();
        mockCompanyService.prototype.create = jest.fn();
        mockCompanyService.prototype.update = jest.fn();
        mockCompanyService.prototype.delete = jest.fn();
    });

    describe('getAllCompanies', () => {
        it('deve retornar todas as empresas com sucesso', async () => {
            const mockCompanies = [
                { id: 1, name: 'Empresa A' },
                { id: 2, name: 'Empresa B' },
            ];

            const mockFindAll = jest.fn().mockResolvedValue(mockCompanies);
            mockCompanyService.prototype.findAll = mockFindAll;

            await getAllCompanies(mockRequest as Request, mockResponse as Response);

            expect(mockFindAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith(mockCompanies);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockFindAll = jest.fn().mockRejectedValue(new Error('Erro de banco'));
            mockCompanyService.prototype.findAll = mockFindAll;

            await getAllCompanies(mockRequest as Request, mockResponse as Response);

            expect(mockFindAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar empresas' });
        });
    });

    describe('getCompanyById', () => {
        it('deve retornar empresa quando encontrada', async () => {
            const mockCompany = { id: 1, name: 'Empresa A' };
            const mockFindById = jest.fn().mockResolvedValue(mockCompany);
            mockCompanyService.prototype.findById = mockFindById;

            mockRequest = {
                params: { id: '1' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockFindById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith(mockCompany);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const mockFindById = jest.fn().mockResolvedValue(null);
            mockCompanyService.prototype.findById = mockFindById;

            mockRequest = {
                params: { id: '999' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockFindById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockFindById = jest.fn().mockRejectedValue(new Error('Erro de banco'));
            mockCompanyService.prototype.findById = mockFindById;

            mockRequest = {
                params: { id: '1' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockFindById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar empresa' });
        });
    });

    describe('createCompany', () => {
        it('deve criar empresa com sucesso', async () => {
            const companyData = { name: 'Nova Empresa' };
            const mockCreatedCompany = { id: 1, name: 'Nova Empresa' };
            const mockCreate = jest.fn().mockResolvedValue(mockCreatedCompany);
            mockCompanyService.prototype.create = mockCreate;

            mockRequest = {
                body: companyData,
            };

            await createCompany(mockRequest as Request, mockResponse as Response);

            expect(mockCreate).toHaveBeenCalledWith(companyData);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedCompany);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Nova Empresa' };
            const error = new Error('Erro de validação');
            const mockCreate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.create = mockCreate;

            mockRequest = {
                body: companyData,
            };

            await createCompany(mockRequest as Request, mockResponse as Response);

            expect(mockCreate).toHaveBeenCalledWith(companyData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao criar empresa',
                details: 'Erro de validação',
            });
        });
    });

    describe('updateCompany', () => {
        it('deve atualizar empresa com sucesso', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const mockUpdatedCompany = { id: 1, name: 'Empresa Atualizada' };
            const mockUpdate = jest.fn().mockResolvedValue(mockUpdatedCompany);
            mockCompanyService.prototype.update = mockUpdate;

            mockRequest = {
                params: { id: '1' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockUpdate).toHaveBeenCalledWith(1, companyData);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedCompany);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Empresa não encontrada');
            const mockUpdate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.update = mockUpdate;

            mockRequest = {
                params: { id: '999' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockUpdate).toHaveBeenCalledWith(999, companyData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Erro de banco');
            const mockUpdate = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.update = mockUpdate;

            mockRequest = {
                params: { id: '1' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockUpdate).toHaveBeenCalledWith(1, companyData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao atualizar empresa',
                details: 'Erro de banco',
            });
        });
    });

    describe('deleteCompany', () => {
        it('deve deletar empresa com sucesso', async () => {
            const mockDelete = jest.fn().mockResolvedValue({
                success: true,
                message: 'Empresa deletada com sucesso',
            });
            mockCompanyService.prototype.delete = mockDelete;

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockDelete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const error = new Error('Empresa não encontrada');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            mockRequest = {
                params: { id: '999' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockDelete).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 400 quando empresa tem projetos relacionados', async () => {
            const error = new Error('Não é possível deletar a empresa pois possui projetos relacionados');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockDelete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Não é possível deletar a empresa pois possui projetos relacionados'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco');
            const mockDelete = jest.fn().mockRejectedValue(error);
            mockCompanyService.prototype.delete = mockDelete;

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockDelete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao deletar empresa',
                details: 'Erro de banco',
            });
        });
    });
}); 