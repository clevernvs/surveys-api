import prisma from '../prisma/client';

export class QuestionService {
    async findAll() {
        try {
            const questions = await prisma.question.findMany({
                include: {
                    questionnaire: {
                        include: {
                            project: {
                                include: {
                                    company: true
                                }
                            }
                        }
                    },
                    answers: {
                        orderBy: {
                            numeric_order: 'asc'
                        }
                    }
                },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return questions;
        } catch (error) {
            console.error('Erro ao buscar questões:', error);
            throw new Error('Erro interno do servidor');
        }
    }
}