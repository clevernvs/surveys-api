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
}