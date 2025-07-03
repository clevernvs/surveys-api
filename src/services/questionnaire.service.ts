import prisma from '../prisma/client';

export class QuestionnaireService {
    async findAll() {
        try {
            const questionnaires = await prisma.questionnaire.findMany({
                include: {
                    project: {
                        include: {
                            company: true
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return questionnaires;
        } catch (error) {
            console.error('Erro ao buscar questionários:', error);
            throw new Error('Erro interno do servidor');
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
                    filter_id: data.filter_id,
                    randomized_answers: data.randomized_answers,
                    status_id: data.status_id,
                    project_id: data.project_id
                }
            });
            return questionnaire;
        } catch (error) {
            throw error;
        }
    }
}