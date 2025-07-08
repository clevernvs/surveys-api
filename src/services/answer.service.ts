import prisma from '../prisma/client';

export class AnswerService {
    async findAll() {
        try {
            const answers = await prisma.answer.findMany();
            return answers;
        } catch (error) {
            throw new Error('Erro ao buscar respostas no banco de dados');
        }
    }

    async create(data: any) {
        try {
            const answer = await prisma.answer.create({
                data: {
                    question_id: data.question_id,
                    answer_type: data.answer_type,
                    value: data.value,
                    fixed: data.fixed ?? false,
                    order_index: data.order_index,
                    skip_to_question_id: data.skip_to_question_id ?? null,
                }
            });
            return answer;
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new Error('A pergunta informada (question_id) não existe.');
            }
            if (error.message) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao criar resposta no banco de dados');
        }
    }

    async update(id: number, data: any) {
        try {
            const existingAnswer = await prisma.answer.findUnique({ where: { id } });
            if (!existingAnswer) {
                throw new Error('Resposta não encontrada');
            }
            const answer = await prisma.answer.update({
                where: { id },
                data: {
                    question_id: data.question_id,
                    answer_type: data.answer_type,
                    value: data.value,
                    fixed: data.fixed ?? false,
                    order_index: data.order_index,
                    skip_to_question_id: data.skip_to_question_id ?? null,
                }
            });
            return answer;
        } catch (error: any) {
            if (error.code === 'P2003') {
                throw new Error('A pergunta informada (question_id) não existe.');
            }
            if (error.code === 'P2025') {
                throw new Error('Resposta não encontrada');
            }
            if (error.message) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao atualizar resposta no banco de dados');
        }
    }

    async delete(id: number) {
        try {
            const existingAnswer = await prisma.answer.findUnique({ where: { id } });
            if (!existingAnswer) {
                throw new Error('Resposta não encontrada');
            }
            await prisma.answer.delete({ where: { id } });
            return { success: true, message: `Resposta (ID: ${id}) deletada com sucesso` };
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error('Resposta não encontrada');
            }
            if (error.message) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao deletar resposta do banco de dados');
        }
    }

    async findById(id: number) {
        try {
            const answer = await prisma.answer.findUnique({ where: { id } });
            if (!answer) {
                throw new Error('Resposta não encontrada');
            }
            return answer;
        } catch (error: any) {
            if (error.message) {
                throw new Error(error.message);
            }
            throw new Error('Erro ao buscar resposta no banco de dados');
        }
    }
}