import { mockPrisma, resetPrismaMock } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import { AnswerService } from '../../services/answer.service';

describe('AnswerService', () => {
    let answerService: AnswerService;

    beforeEach(() => {
        answerService = new AnswerService();
        resetPrismaMock();
    });

    describe('findAll', () => {
        it('deve retornar todas as respostas', async () => {
            const mockAnswers = [
                { id: 1, question_id: 1, value: 'Resposta 1' },
                { id: 2, question_id: 1, value: 'Resposta 2' }
            ];
            mockPrisma.answer.findMany.mockResolvedValue(mockAnswers);
            const result = await answerService.findAll();
            expect(mockPrisma.answer.findMany).toHaveBeenCalledWith();
            expect(result).toEqual(mockAnswers);
        });
        it('deve lançar erro ao falhar', async () => {
            mockPrisma.answer.findMany.mockRejectedValue(new Error('DB error'));
            await expect(answerService.findAll()).rejects.toThrow('Erro ao buscar respostas no banco de dados');
        });
    });

    describe('findById', () => {
        it('deve retornar resposta por ID', async () => {
            const mockAnswer = { id: 1, question_id: 1, value: 'Resposta 1' };
            mockPrisma.answer.findUnique.mockResolvedValue(mockAnswer);
            const result = await answerService.findById(1);
            expect(mockPrisma.answer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(mockAnswer);
        });
        it('deve lançar erro se não encontrar', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            await expect(answerService.findById(999)).rejects.toThrow('Resposta não encontrada');
        });
        it('deve lançar erro ao falhar', async () => {
            mockPrisma.answer.findUnique.mockRejectedValue(new Error('DB error'));
            await expect(answerService.findById(1)).rejects.toThrow('DB error');
        });
    });

    describe('create', () => {
        it('deve criar resposta com sucesso', async () => {
            const data = { question_id: 1, answer_type: 'TEXT', value: 'Nova resposta', order_index: 1 };
            const mockCreated = { id: 1, ...data, fixed: false, skip_to_question_id: null };
            mockPrisma.answer.create.mockResolvedValue(mockCreated);
            const result = await answerService.create(data);
            expect(mockPrisma.answer.create).toHaveBeenCalledWith({
                data: {
                    question_id: 1,
                    answer_type: 'TEXT',
                    value: 'Nova resposta',
                    fixed: false,
                    order_index: 1,
                    skip_to_question_id: null
                }
            });
            expect(result).toEqual(mockCreated);
        });
        it('deve aplicar valores padrão', async () => {
            const data = { question_id: 1, value: 'Nova resposta', order_index: 1 };
            const mockCreated = { id: 1, ...data, answer_type: 'TEXT', fixed: false, skip_to_question_id: null };
            mockPrisma.answer.create.mockResolvedValue(mockCreated);
            const result = await answerService.create(data);
            expect(mockPrisma.answer.create).toHaveBeenCalledWith({
                data: {
                    question_id: 1,
                    answer_type: 'TEXT',
                    value: 'Nova resposta',
                    fixed: false,
                    order_index: 1,
                    skip_to_question_id: null
                }
            });
            expect(result).toEqual(mockCreated);
        });
        it('deve lançar erro se question_id não existe', async () => {
            const data = { question_id: 999, value: 'Nova resposta', order_index: 1 };
            const error = new Error('Foreign key constraint failed') as any;
            error.code = 'P2003';
            mockPrisma.answer.create.mockRejectedValue(error);
            await expect(answerService.create(data)).rejects.toThrow('A pergunta informada (question_id) não existe.');
        });
        it('deve lançar erro genérico ao falhar', async () => {
            const data = { question_id: 1, value: 'Nova resposta', order_index: 1 };
            mockPrisma.answer.create.mockRejectedValue(new Error('DB error'));
            await expect(answerService.create(data)).rejects.toThrow('DB error');
        });
    });

    describe('update', () => {
        it('deve atualizar resposta com sucesso', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta antiga' };
            const updateData = { value: 'Resposta atualizada', order_index: 2 };
            const updated = { ...existing, ...updateData };
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.update.mockResolvedValue(updated);
            const result = await answerService.update(1, updateData);
            expect(mockPrisma.answer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.answer.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    question_id: undefined,
                    answer_type: undefined,
                    value: 'Resposta atualizada',
                    fixed: false,
                    order_index: 2,
                    skip_to_question_id: null
                }
            });
            expect(result).toEqual(updated);
        });
        it('deve lançar erro se resposta não encontrada', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            await expect(answerService.update(999, { value: 'R' })).rejects.toThrow('Resposta não encontrada');
            expect(mockPrisma.answer.update).not.toHaveBeenCalled();
        });
        it('deve lançar erro se question_id não existe', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta antiga' };
            const error = new Error('Foreign key constraint failed') as any;
            error.code = 'P2003';
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.update.mockRejectedValue(error);
            await expect(answerService.update(1, { question_id: 999 })).rejects.toThrow('A pergunta informada (question_id) não existe.');
        });
        it('deve lançar erro se resposta não encontrada no update', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta antiga' };
            const error = new Error('Record not found') as any;
            error.code = 'P2025';
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.update.mockRejectedValue(error);
            await expect(answerService.update(1, { value: 'R' })).rejects.toThrow('Resposta não encontrada');
        });
        it('deve lançar erro genérico ao falhar', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta antiga' };
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.update.mockRejectedValue(new Error('DB error'));
            await expect(answerService.update(1, { value: 'R' })).rejects.toThrow('DB error');
        });
    });

    describe('delete', () => {
        it('deve deletar resposta com sucesso', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta para deletar' };
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.delete.mockResolvedValue(existing);
            const result = await answerService.delete(1);
            expect(mockPrisma.answer.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.answer.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ success: true, message: 'Resposta (ID: 1) deletada com sucesso' });
        });
        it('deve lançar erro se resposta não encontrada', async () => {
            mockPrisma.answer.findUnique.mockResolvedValue(null);
            await expect(answerService.delete(999)).rejects.toThrow('Resposta não encontrada');
            expect(mockPrisma.answer.delete).not.toHaveBeenCalled();
        });
        it('deve lançar erro se resposta não encontrada no delete', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta para deletar' };
            const error = new Error('Record not found') as any;
            error.code = 'P2025';
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.delete.mockRejectedValue(error);
            await expect(answerService.delete(1)).rejects.toThrow('Resposta não encontrada');
        });
        it('deve lançar erro genérico ao falhar', async () => {
            const existing = { id: 1, question_id: 1, value: 'Resposta para deletar' };
            mockPrisma.answer.findUnique.mockResolvedValue(existing);
            mockPrisma.answer.delete.mockRejectedValue(new Error('DB error'));
            await expect(answerService.delete(1)).rejects.toThrow('DB error');
        });
    });
}); 