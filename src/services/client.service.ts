import prisma from '../prisma/client';

export class ClientService {
    async findAll() {
        try {
            const clients = await prisma.client.findMany();
            return clients;
        } catch (error) {
            throw new Error('Erro ao buscar clientes no banco de dados');
        }
    }

    async findById(id: number) {
        try {
            const client = await prisma.client.findUnique({
                where: { id }
            });

            if (!client) {
                return null;
            }

            return client;
        } catch (error) {
            throw new Error('Erro ao buscar cliente no banco de dados');
        }
    }

    async create(data: { name: string; email: string }) {
        try {
            // Validação básica
            if (!data.name || data.name.trim() === '') {
                throw new Error('Nome é obrigatório');
            }

            const client = await prisma.client.create({
                data: {
                    name: data.name.trim(),
                    email: data.email.trim()
                }
            });

            return client;
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error('Já existe um cliente com esse email');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro de banco de dados');
        }
    }

    async update(id: number, data: Partial<{ name: string; email: string }>) {
        try {
            // Verificar se o cliente existe
            const existingClient = await prisma.client.findUnique({
                where: { id }
            });

            if (!existingClient) {
                throw new Error('Cliente não encontrado');
            }

            // Validação básica
            if (data.name !== undefined && data.name.trim() === '') {
                throw new Error('Nome é obrigatório');
            }

            const client = await prisma.client.update({
                where: { id },
                data: {
                    ...(data.name && { name: data.name.trim() }),
                    ...(data.email && { email: data.email.trim() })
                }
            });

            return client;
        } catch (error: any) {
            if (error.code === 'P2002') {
                throw new Error('Já existe um cliente com esse email');
            }

            if (error.code === 'P2025') {
                throw new Error('Cliente não encontrado');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro de banco de dados');
        }
    }

    async delete(id: number) {
        try {
            const existingClient = await prisma.client.findUnique({
                where: { id }
            });

            if (!existingClient) {
                throw new Error('Cliente não encontrado');
            }

            await prisma.client.delete({
                where: { id }
            });

            return {
                success: true,
                message: `Cliente "${existingClient.name}" (ID: ${id}) deletado com sucesso`
            };
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error('Cliente não encontrado');
            }

            if (error.code === 'P2003') {
                throw new Error('Não é possível deletar o cliente pois possui projetos relacionados');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao deletar cliente do banco de dados');
        }
    }
} 