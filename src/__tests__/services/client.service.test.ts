import { mockPrisma } from '../mocks/prisma.mock';
import { ClientService } from '../../services/client.service';

// Mock do Prisma
jest.mock('../../prisma/client', () => mockPrisma);

describe('ClientService', () => {
    let clientService: ClientService;

    beforeEach(() => {
        clientService = new ClientService();
        Object.values(mockPrisma.client).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockClear();
            }
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os clientes', async () => {
            const mockClients = [
                { id: 1, name: 'Cliente A', email: 'clientea@test.com' },
                { id: 2, name: 'Cliente B', email: 'clienteb@test.com' }
            ];
            mockPrisma.client.findMany.mockResolvedValue(mockClients);

            const result = await clientService.findAll();

            expect(mockPrisma.client.findMany).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockClients);
        });

        it('deve lançar erro quando falhar ao buscar clientes', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.client.findMany.mockRejectedValue(error);

            await expect(clientService.findAll()).rejects.toThrow('Erro ao buscar clientes no banco de dados');
            expect(mockPrisma.client.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('deve retornar cliente por ID', async () => {
            const mockClient = { id: 1, name: 'Cliente A', email: 'clientea@test.com' };
            mockPrisma.client.findUnique.mockResolvedValue(mockClient);

            const result = await clientService.findById(1);

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockClient);
        });

        it('deve retornar null quando cliente não encontrado', async () => {
            mockPrisma.client.findUnique.mockResolvedValue(null);

            const result = await clientService.findById(999);

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(result).toBeNull();
        });

        it('deve lançar erro quando falhar ao buscar cliente', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.client.findUnique.mockRejectedValue(error);

            await expect(clientService.findById(1)).rejects.toThrow('Erro ao buscar cliente no banco de dados');
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });
    });

    describe('create', () => {
        it('deve criar cliente com sucesso', async () => {
            const clientData = { name: 'Novo Cliente', email: 'novo@test.com' };
            const mockCreatedClient = { id: 1, name: 'Novo Cliente', email: 'novo@test.com' };

            mockPrisma.client.create.mockResolvedValue(mockCreatedClient);

            const result = await clientService.create(clientData);

            expect(mockPrisma.client.create).toHaveBeenCalledWith({
                data: { name: 'Novo Cliente', email: 'novo@test.com' }
            });
            expect(result).toEqual(mockCreatedClient);
        });

        it('deve lançar erro quando nome estiver vazio', async () => {
            const clientData = { name: '', email: 'test@test.com' };

            await expect(clientService.create(clientData)).rejects.toThrow('Nome é obrigatório');
            expect(mockPrisma.client.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando email já existir', async () => {
            const clientData = { name: 'Cliente Existente', email: 'existente@test.com' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.client.create.mockRejectedValue(error);

            await expect(clientService.create(clientData)).rejects.toThrow('Já existe um cliente com esse email');
            expect(mockPrisma.client.create).toHaveBeenCalledWith({
                data: { name: 'Cliente Existente', email: 'existente@test.com' }
            });
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const clientData = { name: 'Novo Cliente', email: 'novo@test.com' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.client.create.mockRejectedValue(error);

            await expect(clientService.create(clientData)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.client.create).toHaveBeenCalledWith({
                data: { name: 'Novo Cliente', email: 'novo@test.com' }
            });
        });
    });

    describe('update', () => {
        it('deve atualizar cliente com sucesso', async () => {
            const existingClient = { id: 1, name: 'Cliente Antigo', email: 'antigo@test.com' };
            const updateData = { name: 'Cliente Atualizado' };
            const mockUpdatedClient = { id: 1, name: 'Cliente Atualizado', email: 'antigo@test.com' };

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.update.mockResolvedValue(mockUpdatedClient);

            const result = await clientService.update(1, updateData);

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.client.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { name: 'Cliente Atualizado' }
            });
            expect(result).toEqual(mockUpdatedClient);
        });

        it('deve lançar erro quando cliente não encontrado', async () => {
            const updateData = { name: 'Cliente Atualizado' };

            mockPrisma.client.findUnique.mockResolvedValue(null);

            await expect(clientService.update(999, updateData)).rejects.toThrow('Cliente não encontrado');
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.client.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando nome estiver vazio', async () => {
            const existingClient = { id: 1, name: 'Cliente Antigo', email: 'antigo@test.com' };
            const updateData = { name: '' };

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);

            await expect(clientService.update(1, updateData)).rejects.toThrow('Nome é obrigatório');
            expect(mockPrisma.client.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando email já existir', async () => {
            const existingClient = { id: 1, name: 'Cliente Antigo', email: 'antigo@test.com' };
            const updateData = { email: 'existente@test.com' };
            const error = new Error('Unique constraint failed');
            (error as any).code = 'P2002';

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.update.mockRejectedValue(error);

            await expect(clientService.update(1, updateData)).rejects.toThrow('Já existe um cliente com esse email');
        });

        it('deve lançar erro quando cliente não encontrado na atualização', async () => {
            const existingClient = { id: 1, name: 'Cliente Antigo', email: 'antigo@test.com' };
            const updateData = { name: 'Cliente Atualizado' };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.update.mockRejectedValue(error);

            await expect(clientService.update(1, updateData)).rejects.toThrow('Cliente não encontrado');
        });
    });

    describe('delete', () => {
        it('deve deletar cliente com sucesso', async () => {
            const existingClient = { id: 1, name: 'Cliente para Deletar', email: 'deletar@test.com' };

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.delete.mockResolvedValue(existingClient);

            const result = await clientService.delete(1);

            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.client.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({
                success: true,
                message: 'Cliente "Cliente para Deletar" (ID: 1) deletado com sucesso'
            });
        });

        it('deve lançar erro quando cliente não encontrado', async () => {
            mockPrisma.client.findUnique.mockResolvedValue(null);

            await expect(clientService.delete(999)).rejects.toThrow('Cliente não encontrado');
            expect(mockPrisma.client.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.client.delete).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando cliente possui projetos relacionados', async () => {
            const existingClient = { id: 1, name: 'Cliente com Projetos', email: 'projetos@test.com' };
            const error = new Error('Foreign key constraint failed');
            (error as any).code = 'P2003';

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.delete.mockRejectedValue(error);

            await expect(clientService.delete(1)).rejects.toThrow('Não é possível deletar o cliente pois possui projetos relacionados');
        });

        it('deve lançar erro quando cliente não encontrado na deleção', async () => {
            const existingClient = { id: 1, name: 'Cliente para Deletar', email: 'deletar@test.com' };
            const error = new Error('Record not found');
            (error as any).code = 'P2025';

            mockPrisma.client.findUnique.mockResolvedValue(existingClient);
            mockPrisma.client.delete.mockRejectedValue(error);

            await expect(clientService.delete(1)).rejects.toThrow('Cliente não encontrado');
        });
    });
}); 