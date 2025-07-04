// Mock do módulo prisma
const mockPrisma = {
    company: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

jest.mock('../../prisma/client', () => ({
    __esModule: true,
    default: mockPrisma,
}));

import { CompanyService } from '../../services/company.service';

describe('CompanyService', () => {
    let companyService: CompanyService;

    beforeEach(() => {
        companyService = new CompanyService();
        // Reset dos mocks
        Object.values(mockPrisma.company).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockReset();
            }
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as empresas com sucesso', async () => {
            const mockCompanies = [
                { id: 1, name: 'Empresa A' },
                { id: 2, name: 'Empresa B' },
            ];

            mockPrisma.company.findMany.mockResolvedValue(mockCompanies);

            const result = await companyService.findAll();

            expect(mockPrisma.company.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockCompanies);
        });

        it('deve lançar erro quando falhar ao buscar empresas', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.company.findMany.mockRejectedValue(error);

            await expect(companyService.findAll()).rejects.toThrow('Erro ao buscar empresas no banco de dados');
            expect(mockPrisma.company.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('deve retornar empresa quando encontrada', async () => {
            const mockCompany = { id: 1, name: 'Empresa A' };
            mockPrisma.company.findUnique.mockResolvedValue(mockCompany);

            const result = await companyService.findById(1);

            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockCompany);
        });

        it('deve retornar null quando empresa não encontrada', async () => {
            mockPrisma.company.findUnique.mockResolvedValue(null);

            const result = await companyService.findById(999);

            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(result).toBeNull();
        });

        it('deve lançar erro quando falhar ao buscar empresa', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.company.findUnique.mockRejectedValue(error);

            await expect(companyService.findById(1)).rejects.toThrow('Erro ao buscar empresa no banco de dados');
            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });

    describe('create', () => {
        it('deve criar empresa com sucesso', async () => {
            const companyData = { name: 'Nova Empresa' };
            const mockCreatedCompany = { id: 1, name: 'Nova Empresa' };

            mockPrisma.company.create.mockResolvedValue(mockCreatedCompany);

            const result = await companyService.create(companyData);

            expect(mockPrisma.company.create).toHaveBeenCalledWith({
                data: { name: 'Nova Empresa' }
            });
            expect(result).toEqual(mockCreatedCompany);
        });

        it('deve lançar erro quando nome não for fornecido', async () => {
            const companyData = { name: '' };

            await expect(companyService.create(companyData)).rejects.toThrow('Nome é obrigatório');
            expect(mockPrisma.company.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando nome já existir (P2002)', async () => {
            const companyData = { name: 'Empresa Existente' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.company.create.mockRejectedValue(error);

            await expect(companyService.create(companyData)).rejects.toThrow('Já existe uma empresa com esse nome');
            expect(mockPrisma.company.create).toHaveBeenCalledWith({
                data: { name: 'Empresa Existente' }
            });
        });

        it('deve lançar erro quando falhar ao criar empresa', async () => {
            const companyData = { name: 'Nova Empresa' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.company.create.mockRejectedValue(error);

            await expect(companyService.create(companyData)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.company.create).toHaveBeenCalledWith({
                data: { name: 'Nova Empresa' }
            });
        });
    });

    describe('update', () => {
        it('deve atualizar empresa com sucesso', async () => {
            const existingCompany = { id: 1, name: 'Empresa Antiga' };
            const updateData = { name: 'Empresa Atualizada' };
            const mockUpdatedCompany = { id: 1, name: 'Empresa Atualizada' };

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.update.mockResolvedValue(mockUpdatedCompany);

            const result = await companyService.update(1, updateData);

            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.company.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Empresa Atualizada' }
            });
            expect(result).toEqual(mockUpdatedCompany);
        });

        it('deve lançar erro quando empresa não encontrada', async () => {
            const updateData = { name: 'Empresa Atualizada' };

            mockPrisma.company.findUnique.mockResolvedValue(null);

            await expect(companyService.update(999, updateData)).rejects.toThrow('Empresa não encontrada');
            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.company.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando nome não for fornecido', async () => {
            const existingCompany = { id: 1, name: 'Empresa Antiga' };
            const updateData = { name: '' };

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);

            await expect(companyService.update(1, updateData)).rejects.toThrow('Nome é obrigatório');
            expect(mockPrisma.company.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando nome já existir (P2002)', async () => {
            const existingCompany = { id: 1, name: 'Empresa Antiga' };
            const updateData = { name: 'Empresa Existente' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.update.mockRejectedValue(error);

            await expect(companyService.update(1, updateData)).rejects.toThrow('Já existe uma empresa com esse nome');
        });

        it('deve lançar erro quando empresa não encontrada no update (P2025)', async () => {
            const existingCompany = { id: 1, name: 'Empresa Antiga' };
            const updateData = { name: 'Empresa Atualizada' };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.update.mockRejectedValue(error);

            await expect(companyService.update(1, updateData)).rejects.toThrow('Empresa não encontrada');
        });
    });

    describe('delete', () => {
        it('deve deletar empresa com sucesso', async () => {
            const existingCompany = { id: 1, name: 'Empresa para Deletar' };

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.delete.mockResolvedValue(existingCompany);

            const result = await companyService.delete(1);

            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.company.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                success: true,
                message: 'Empresa "Empresa para Deletar" (ID: 1) deletada com sucesso'
            });
        });

        it('deve lançar erro quando empresa não encontrada', async () => {
            mockPrisma.company.findUnique.mockResolvedValue(null);

            await expect(companyService.delete(999)).rejects.toThrow('Empresa não encontrada');
            expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.company.delete).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando empresa tem projetos relacionados (P2003)', async () => {
            const existingCompany = { id: 1, name: 'Empresa com Projetos' };
            const error = new Error('Foreign key constraint failed');
            (error as any).code = 'P2003';

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.delete.mockRejectedValue(error);

            await expect(companyService.delete(1)).rejects.toThrow('Não é possível deletar a empresa pois possui projetos relacionados');
        });

        it('deve lançar erro quando empresa não encontrada no delete (P2025)', async () => {
            const existingCompany = { id: 1, name: 'Empresa para Deletar' };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.company.findUnique.mockResolvedValue(existingCompany);
            mockPrisma.company.delete.mockRejectedValue(error);

            await expect(companyService.delete(1)).rejects.toThrow('Empresa não encontrada');
        });
    });
}); 