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
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            throw new Error('Erro ao criar projeto no banco de dados');
        }
    }

    async update(id: number, data: any) {
        try {
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
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            throw new Error('Erro ao atualizar projeto no banco de dados');
        }
    }

    async delete(id: number) {
        try {
            await prisma.project.delete({
                where: { id }
            });
            return { success: true, message: `Projeto ${id} deletado com sucesso` };
        } catch (error) {
            console.error('Erro ao deletar projeto:', error);
            throw new Error('Erro ao deletar projeto do banco de dados');
        }
    }
}