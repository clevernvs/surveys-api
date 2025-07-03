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

    async create(data: any) {
        try {
            // Verifica se o questionário existe
            const questionnaire = await prisma.questionnaire.findUnique({
                where: { id: data.questionnaire_id }
            });
            if (!questionnaire) {
                throw new Error('Questionário não encontrado');
            }

            const question = await prisma.question.create({
                data: {
                    title: data.title,
                    question_type_id: data.question_type_id,
                    required: data.required || false,
                    questionnaire_id: data.questionnaire_id
                },
                include: {
                    questionnaire: {
                        include: {
                            project: {
                                include: {
                                    company: true
                                }
                            }
                        }
                    }
                }
            });
            return question;
        } catch (error) {
            throw error;
        }
    }
}