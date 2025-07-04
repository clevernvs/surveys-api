import { Request, Response } from 'express';

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

import {
    getAllCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from '../../controllers/company.controller';

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
    });

    describe('getAllCompanies', () => {
        it('deve retornar todas as empresas com sucesso', async () => {
            const mockCompanies = [
                { id: 1, name: 'Empresa A' },
                { id: 2, name: 'Empresa B' },
            ];

            mockService.findAll.mockResolvedValue(mockCompanies);

            await getAllCompanies(mockRequest as Request, mockResponse as Response);

            expect(mockService.findAll).toHaveBeenCalledTimes(1);
            expect(mockJson).toHaveBeenCalledWith(mockCompanies);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            mockService.findAll.mockRejectedValue(new Error('Erro de banco'));

            await getAllCompanies(mockRequest as Request, mockResponse as Response);

            expect(mockService.findAll).toHaveBeenCalledTimes(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar empresas' });
        });
    });

    describe('getCompanyById', () => {
        it('deve retornar empresa quando encontrada', async () => {
            const mockCompany = { id: 1, name: 'Empresa A' };
            mockService.findById.mockResolvedValue(mockCompany);

            mockRequest = {
                params: { id: '1' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockService.findById).toHaveBeenCalledWith(1);
            expect(mockJson).toHaveBeenCalledWith(mockCompany);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            mockService.findById.mockResolvedValue(null);

            mockRequest = {
                params: { id: '999' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockService.findById).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            mockService.findById.mockRejectedValue(new Error('Erro de banco'));

            mockRequest = {
                params: { id: '1' },
            };

            await getCompanyById(mockRequest as Request, mockResponse as Response);

            expect(mockService.findById).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Erro ao buscar empresa' });
        });
    });

    describe('createCompany', () => {
        it('deve criar empresa com sucesso', async () => {
            const companyData = { name: 'Nova Empresa' };
            const mockCreatedCompany = { id: 1, name: 'Nova Empresa' };
            mockService.create.mockResolvedValue(mockCreatedCompany);

            mockRequest = {
                body: companyData,
            };

            await createCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.create).toHaveBeenCalledWith(companyData);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(mockCreatedCompany);
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Nova Empresa' };
            const error = new Error('Erro de validação');
            mockService.create.mockRejectedValue(error);

            mockRequest = {
                body: companyData,
            };

            await createCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.create).toHaveBeenCalledWith(companyData);
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
            mockService.update.mockResolvedValue(mockUpdatedCompany);

            mockRequest = {
                params: { id: '1' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.update).toHaveBeenCalledWith(1, companyData);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(mockUpdatedCompany);
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Empresa não encontrada');
            mockService.update.mockRejectedValue(error);

            mockRequest = {
                params: { id: '999' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.update).toHaveBeenCalledWith(999, companyData);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const companyData = { name: 'Empresa Atualizada' };
            const error = new Error('Erro de banco');
            mockService.update.mockRejectedValue(error);

            mockRequest = {
                params: { id: '1' },
                body: companyData,
            };

            await updateCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.update).toHaveBeenCalledWith(1, companyData);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao atualizar empresa',
                details: 'Erro de banco',
            });
        });
    });

    describe('deleteCompany', () => {
        it('deve deletar empresa com sucesso', async () => {
            mockService.delete.mockResolvedValue({
                success: true,
                message: 'Empresa deletada com sucesso',
            });

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(204);
            expect(mockResponse.send).toHaveBeenCalled();
        });

        it('deve retornar erro 404 quando empresa não encontrada', async () => {
            const error = new Error('Empresa não encontrada');
            mockService.delete.mockRejectedValue(error);

            mockRequest = {
                params: { id: '999' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.delete).toHaveBeenCalledWith(999);
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Empresa não encontrada' });
        });

        it('deve retornar erro 400 quando empresa tem projetos relacionados', async () => {
            const error = new Error('Não é possível deletar a empresa pois possui projetos relacionados');
            mockService.delete.mockRejectedValue(error);

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Não é possível deletar a empresa pois possui projetos relacionados'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco');
            mockService.delete.mockRejectedValue(error);

            mockRequest = {
                params: { id: '1' },
            };

            await deleteCompany(mockRequest as Request, mockResponse as Response);

            expect(mockService.delete).toHaveBeenCalledWith(1);
            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                error: 'Erro ao deletar empresa',
                details: 'Erro de banco',
            });
        });
    });
}); 