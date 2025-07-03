import prisma from '../prisma/client';

export class AnswerService {
    async findAll() {
        try {
            const answers = await prisma.answer.findMany();
            return answers;
        } catch (error) {
            console.error('Erro ao buscar respostas:', error);
            throw new Error('Erro ao buscar respostas no banco de dados');
        }
    }
}