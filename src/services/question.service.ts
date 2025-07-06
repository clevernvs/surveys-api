import prisma from '../prisma/client';

export class QuestionService {
    async findAll() {
        try {
            const questions = await prisma.question.findMany({
                include: {
                    questionnaire: {
                        include: {
                            project: true
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

    async findById(id: number) {
        try {
            const question = await prisma.question.findUnique({
                where: { id },
                include: {
                    questionnaire: {
                        include: {
                            project: true
                        }
                    },
                    answers: {
                        orderBy: {
                            numeric_order: 'asc'
                        }
                    }
                }
            });

            if (!question) {
                throw new Error('Questão não encontrada');
            }

            return question;
        } catch (error) {
            throw error;
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
                            project: true
                        }
                    }
                }
            });
            return question;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            // Verifica se a questão existe
            const existingQuestion = await prisma.question.findUnique({
                where: { id }
            });
            if (!existingQuestion) {
                throw new Error('Questão não encontrada');
            }

            // Se questionnaire_id foi fornecido, verifica se o questionário existe
            if (data.questionnaire_id) {
                const questionnaire = await prisma.questionnaire.findUnique({
                    where: { id: data.questionnaire_id }
                });
                if (!questionnaire) {
                    throw new Error('Questionário não encontrado');
                }
            }

            const question = await prisma.question.update({
                where: { id },
                data: {
                    title: data.title,
                    question_type_id: data.question_type_id,
                    required: data.required,
                    questionnaire_id: data.questionnaire_id
                },
                include: {
                    questionnaire: {
                        include: {
                            project: true
                        }
                    }
                }
            });
            return question;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            // Verifica se a questão existe
            const existingQuestion = await prisma.question.findUnique({
                where: { id }
            });
            if (!existingQuestion) {
                throw new Error('Questão não encontrada');
            }

            // Exclui a questão
            await prisma.question.delete({
                where: { id }
            });

            return { message: 'Questão excluída com sucesso' };
        } catch (error) {
            throw error;
        }
    }
}