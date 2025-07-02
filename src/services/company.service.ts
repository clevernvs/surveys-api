import prisma from '../prisma/client';

export class CompanyService {
    async findAll() {
        try {
            const companies = await prisma.company.findMany();
            return companies;
        } catch (error) {
            console.error('Erro ao buscar empresas:', error);
            throw new Error('Erro ao buscar empresas no banco de dados');
        }
    }

    async findById(id: number) {
        try {
            const company = await prisma.company.findUnique({
                where: { id }
            });

            if (!company) {
                return null;
            }

            return company;
        } catch (error) {
            console.error('Erro ao buscar empresa por ID:', error);
            throw new Error('Erro ao buscar empresa no banco de dados');
        }
    }

    async create(data: any) {
        try {
            if (!data.name) {
                throw new Error('Nome é obrigatório');
            }

            const company = await prisma.company.create({
                data: {
                    name: data.name
                }
            });

            return company;
        } catch (error: any) {
            console.error('Erro ao criar empresa:', error);

            if (error.code === 'P2002') {
                throw new Error('Já existe uma empresa com esse nome');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao criar empresa no banco de dados');
        }
    }

    async update(id: number, data: any) {
        try {
            const existingCompany = await prisma.company.findUnique({
                where: { id }
            });

            if (!existingCompany) {
                throw new Error('Empresa não encontrada');
            }

            if (!data.name) {
                throw new Error('Nome é obrigatório');
            }

            const company = await prisma.company.update({
                where: { id },
                data: {
                    name: data.name
                }
            });

            return company;
        } catch (error: any) {
            console.error('Erro ao atualizar empresa:', error);

            if (error.code === 'P2025') {
                throw new Error('Empresa não encontrada');
            }

            if (error.code === 'P2002') {
                throw new Error('Já existe uma empresa com esse nome');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao atualizar empresa no banco de dados');
        }
    }

    async delete(id: number) {
        try {
            const existingCompany = await prisma.company.findUnique({
                where: { id }
            });

            if (!existingCompany) {
                throw new Error('Empresa não encontrada');
            }

            await prisma.company.delete({
                where: { id }
            });

            return {
                success: true,
                message: `Empresa "${existingCompany.name}" (ID: ${id}) deletada com sucesso`
            };
        } catch (error: any) {
            console.error('Erro ao deletar empresa:', error);

            if (error.code === 'P2025') {
                throw new Error('Empresa não encontrada');
            }

            if (error.code === 'P2003') {
                throw new Error('Não é possível deletar a empresa pois possui projetos relacionados');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao deletar empresa do banco de dados');
        }
    }
}