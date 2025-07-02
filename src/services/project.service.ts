import prisma from '../prisma/client';

export class ProjectService {
    async findAll() {
        try {
            const projects = await prisma.project.findMany({
                include: {
                    company: true
                }
            });

            // Converter campos camelCase para snake_case para manter compatibilidade
            return projects.map(project => ({
                id: project.id,
                title: project.title,
                description: project.description,
                project_type_id: project.projectTypeId,
                language_id: project.languageId,
                category_id: project.categoryId,
                sample_source_id: project.sampleSourceId,
                community_id: project.communityId,
                status: project.status,
                sample_size: project.sampleSize,
                start_date: project.startDate,
                end_date: project.endDate,
                company_id: project.companyId,
                company: project.company,
                created_at: project.createdAt,
                updated_at: project.updatedAt
            }));
        } catch (error) {
            console.error('Erro ao buscar projetos:', error);
            throw new Error('Erro ao buscar projetos no banco de dados');
        }
    }

    async findById(id: number) {
        try {
            const project = await prisma.project.findUnique({
                where: { id },
                include: {
                    company: true
                }
            });

            if (!project) {
                return null;
            }

            // Converter campos camelCase para snake_case
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                project_type_id: project.projectTypeId,
                language_id: project.languageId,
                category_id: project.categoryId,
                sample_source_id: project.sampleSourceId,
                community_id: project.communityId,
                status: project.status,
                sample_size: project.sampleSize,
                start_date: project.startDate,
                end_date: project.endDate,
                company_id: project.companyId,
                company: project.company,
                created_at: project.createdAt,
                updated_at: project.updatedAt
            };
        } catch (error) {
            console.error('Erro ao buscar projeto por ID:', error);
            throw new Error('Erro ao buscar projeto no banco de dados');
        }
    }

    async create(data: any) {
        try {
            // Validações básicas
            if (!data.title || !data.description || !data.company_id) {
                throw new Error('Título, descrição e company_id são obrigatórios');
            }

            // Validar se a company existe
            const company = await prisma.company.findUnique({
                where: { id: data.company_id }
            });

            if (!company) {
                throw new Error('Empresa não encontrada');
            }

            // Converter campos snake_case para camelCase para o Prisma
            const projectData = {
                title: data.title,
                description: data.description,
                projectTypeId: data.project_type_id,
                languageId: data.language_id,
                categoryId: data.category_id,
                sampleSourceId: data.sample_source_id,
                communityId: data.community_id,
                status: data.status,
                sampleSize: data.sample_size,
                startDate: new Date(data.start_date),
                endDate: new Date(data.end_date),
                companyId: data.company_id
            };

            const project = await prisma.project.create({
                data: projectData,
                include: {
                    company: true
                }
            });

            // Converter de volta para snake_case
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                project_type_id: project.projectTypeId,
                language_id: project.languageId,
                category_id: project.categoryId,
                sample_source_id: project.sampleSourceId,
                community_id: project.communityId,
                status: project.status,
                sample_size: project.sampleSize,
                start_date: project.startDate,
                end_date: project.endDate,
                company_id: project.companyId,
                company: project.company,
                created_at: project.createdAt,
                updated_at: project.updatedAt
            };
        } catch (error: any) {
            console.error('Erro ao criar projeto:', error);

            // Tratamento específico de erros do Prisma
            if (error.code === 'P2002') {
                throw new Error('Já existe um projeto com esses dados');
            }

            if (error.code === 'P2003') {
                throw new Error('Referência inválida (foreign key constraint)');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao criar projeto no banco de dados');
        }
    }

    async update(id: number, data: any) {
        try {
            // Verificar se o projeto existe
            const existingProject = await prisma.project.findUnique({
                where: { id }
            });

            if (!existingProject) {
                throw new Error('Projeto não encontrado');
            }

            // Validações básicas
            if (!data.title || !data.description || !data.company_id) {
                throw new Error('Título, descrição e company_id são obrigatórios');
            }

            // Validar se a company existe
            const company = await prisma.company.findUnique({
                where: { id: data.company_id }
            });

            if (!company) {
                throw new Error('Empresa não encontrada');
            }

            // Converter campos snake_case para camelCase
            const updateData = {
                title: data.title,
                description: data.description,
                projectTypeId: data.project_type_id,
                languageId: data.language_id,
                categoryId: data.category_id,
                sampleSourceId: data.sample_source_id,
                communityId: data.community_id,
                status: data.status,
                sampleSize: data.sample_size,
                startDate: new Date(data.start_date),
                endDate: new Date(data.end_date),
                companyId: data.company_id
            };

            const project = await prisma.project.update({
                where: { id },
                data: updateData,
                include: {
                    company: true
                }
            });

            // Converter de volta para snake_case
            return {
                id: project.id,
                title: project.title,
                description: project.description,
                project_type_id: project.projectTypeId,
                language_id: project.languageId,
                category_id: project.categoryId,
                sample_source_id: project.sampleSourceId,
                community_id: project.communityId,
                status: project.status,
                sample_size: project.sampleSize,
                start_date: project.startDate,
                end_date: project.endDate,
                company_id: project.companyId,
                company: project.company,
                created_at: project.createdAt,
                updated_at: project.updatedAt
            };
        } catch (error: any) {
            console.error('Erro ao atualizar projeto:', error);

            // Tratamento específico de erros do Prisma
            if (error.code === 'P2025') {
                throw new Error('Projeto não encontrado');
            }

            if (error.code === 'P2002') {
                throw new Error('Já existe um projeto com esses dados');
            }

            if (error.code === 'P2003') {
                throw new Error('Referência inválida (foreign key constraint)');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao atualizar projeto no banco de dados');
        }
    }

    async delete(id: number) {
        try {
            // Verificar se o projeto existe antes de deletar
            const existingProject = await prisma.project.findUnique({
                where: { id }
            });

            if (!existingProject) {
                throw new Error('Projeto não encontrado');
            }

            await prisma.project.delete({
                where: { id }
            });

            return {
                success: true,
                message: `Projeto "${existingProject.title}" (ID: ${id}) deletado com sucesso`
            };
        } catch (error: any) {
            console.error('Erro ao deletar projeto:', error);

            // Tratamento específico de erros do Prisma
            if (error.code === 'P2025') {
                throw new Error('Projeto não encontrado');
            }

            if (error.code === 'P2003') {
                throw new Error('Não é possível deletar o projeto pois possui relacionamentos ativos');
            }

            if (error.message) {
                throw new Error(error.message);
            }

            throw new Error('Erro ao deletar projeto do banco de dados');
        }
    }
}