import prisma from '../prisma/client';

export class QuestionnaireService {
    async findAll() {
        try {
            const questionnaires = await prisma.questionnaire.findMany({
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return questionnaires;
        } catch (error) {
            throw new Error('Erro interno do servidor');
        }
    }

    async findById(id: number) {
        try {
            const questionnaire = await prisma.questionnaire.findUnique({
                where: { id },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });

            if (!questionnaire) {
                throw new Error('Questionário não encontrado');
            }

            return questionnaire;
        } catch (error) {
            throw error;
        }
    }

    async create(data: any) {
        try {
            // Verifica se o projeto existe
            const project = await prisma.project.findUnique({
                where: { id: data.project_id }
            });
            if (!project) {
                throw new Error('Projeto não encontrado');
            }

            const questionnaire = await prisma.questionnaire.create({
                data: {
                    title: data.title,
                    sample_source_id: data.sample_source_id,
                    goal: data.goal,
                    filter_id: data.filter_id,
                    randomized_questions: data.randomized_questions,
                    status: data.status,
                    start_date: new Date(data.start_date),
                    end_date: new Date(data.end_date),
                    project_id: data.project_id
                }
            });
            return questionnaire;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            // Verifica se o questionário existe
            const existingQuestionnaire = await prisma.questionnaire.findUnique({
                where: { id }
            });
            if (!existingQuestionnaire) {
                throw new Error('Questionário não encontrado');
            }

            // Se project_id foi fornecido, verifica se o projeto existe
            if (data.project_id) {
                const project = await prisma.project.findUnique({
                    where: { id: data.project_id }
                });
                if (!project) {
                    throw new Error('Projeto não encontrado');
                }
            }

            const questionnaire = await prisma.questionnaire.update({
                where: { id },
                data: {
                    title: data.title,
                    sample_source_id: data.sample_source_id,
                    goal: data.goal,
                    filter_id: data.filter_id,
                    randomized_questions: data.randomized_questions,
                    status: data.status,
                    start_date: data.start_date ? new Date(data.start_date) : undefined,
                    end_date: data.end_date ? new Date(data.end_date) : undefined,
                    project_id: data.project_id
                },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
            return questionnaire;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            // Verifica se o questionário existe
            const existingQuestionnaire = await prisma.questionnaire.findUnique({
                where: { id }
            });
            if (!existingQuestionnaire) {
                throw new Error('Questionário não encontrado');
            }

            // Deleta o questionário
            await prisma.questionnaire.delete({
                where: { id }
            });

            return { message: 'Questionário deletado com sucesso' };
        } catch (error) {
            throw error;
        }
    }
}