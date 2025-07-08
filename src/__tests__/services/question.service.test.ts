import { mockPrisma, resetPrismaMock } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import { QuestionService } from '../../services/question.service';

describe('QuestionService', () => {
    let questionService: QuestionService;

    beforeEach(() => {
        questionService = new QuestionService();
        resetPrismaMock();
    });

    describe('findAll', () => {
        it('deve retornar todas as questões', async () => {
            const mockQuestions = [
                { id: 1, title: 'Q1', questionnaire_id: 1 },
                { id: 2, title: 'Q2', questionnaire_id: 1 }
            ];
            mockPrisma.question.findMany.mockResolvedValue(mockQuestions);
            const result = await questionService.findAll();
            expect(mockPrisma.question.findMany).toHaveBeenCalledWith({
                include: {
                    questionnaire: true,
                    answers: { orderBy: { order_index: 'asc' } },
                    QuestionMedia: true
                },
                orderBy: { order_index: 'asc' }
            });
            expect(result).toEqual(mockQuestions);
        });
        it('deve lançar erro ao falhar', async () => {
            mockPrisma.question.findMany.mockRejectedValue(new Error('DB error'));
            await expect(questionService.findAll()).rejects.toThrow('Erro interno do servidor');
        });
    });

    describe('findById', () => {
        it('deve retornar questão por ID', async () => {
            const mockQuestion = { id: 1, title: 'Q1', questionnaire_id: 1 };
            mockPrisma.question.findUnique.mockResolvedValue(mockQuestion);
            const result = await questionService.findById(1);
            expect(mockPrisma.question.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    questionnaire: true,
                    answers: { orderBy: { order_index: 'asc' } },
                    QuestionMedia: true
                }
            });
            expect(result).toEqual(mockQuestion);
        });
        it('deve lançar erro se não encontrar', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            await expect(questionService.findById(999)).rejects.toThrow('Questão não encontrada');
        });
        it('deve lançar erro ao falhar', async () => {
            mockPrisma.question.findUnique.mockRejectedValue(new Error('DB error'));
            await expect(questionService.findById(1)).rejects.toThrow('DB error');
        });
    });

    describe('create', () => {
        it('deve criar questão com sucesso', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 1, question_type: 'TEXT', order_index: 1 };
            const mockQuestionnaire = { id: 1 };
            const mockCreated = { id: 1, ...data };
            mockPrisma.questionnaire.findUnique.mockResolvedValue(mockQuestionnaire);
            mockPrisma.question.create.mockResolvedValue(mockCreated);
            const result = await questionService.create(data);
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.question.create).toHaveBeenCalledWith({
                data: {
                    title: 'Q Nova',
                    question_type: 'TEXT',
                    required: false,
                    randomize_answers: false,
                    order_index: 1,
                    kpi: undefined,
                    attributes: undefined,
                    brand: undefined,
                    product_brand: undefined,
                    questionnaire_id: 1
                },
                include: {
                    questionnaire: true,
                    answers: true,
                    QuestionMedia: true
                }
            });
            expect(result).toEqual(mockCreated);
        });
        it('deve lançar erro se questionário não encontrado', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 999, question_type: 'TEXT', order_index: 1 };
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);
            await expect(questionService.create(data)).rejects.toThrow('Questionário não encontrado');
            expect(mockPrisma.question.create).not.toHaveBeenCalled();
        });
        it('deve lançar erro ao falhar', async () => {
            const data = { title: 'Q Nova', questionnaire_id: 1, question_type: 'TEXT', order_index: 1 };
            mockPrisma.questionnaire.findUnique.mockResolvedValue({ id: 1 });
            mockPrisma.question.create.mockRejectedValue(new Error('DB error'));
            await expect(questionService.create(data)).rejects.toThrow('DB error');
        });
    });

    describe('update', () => {
        it('deve atualizar questão com sucesso', async () => {
            const existing = { id: 1, title: 'Q1', questionnaire_id: 1 };
            const updateData = { title: 'Q1 Editada', order_index: 2 };
            const updated = { ...existing, ...updateData };
            mockPrisma.question.findUnique.mockResolvedValue(existing);
            mockPrisma.question.update.mockResolvedValue(updated);
            const result = await questionService.update(1, updateData);
            expect(mockPrisma.question.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.question.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Q1 Editada',
                    question_type: undefined,
                    required: undefined,
                    randomize_answers: undefined,
                    order_index: 2,
                    kpi: undefined,
                    attributes: undefined,
                    brand: undefined,
                    product_brand: undefined,
                    questionnaire_id: undefined
                },
                include: {
                    questionnaire: true,
                    answers: true,
                    QuestionMedia: true
                }
            });
            expect(result).toEqual(updated);
        });
        it('deve lançar erro se questão não encontrada', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            await expect(questionService.update(999, { title: 'Q' })).rejects.toThrow('Questão não encontrada');
            expect(mockPrisma.question.update).not.toHaveBeenCalled();
        });
        it('deve lançar erro se questionnaire_id não existe', async () => {
            const existing = { id: 1, title: 'Q1', questionnaire_id: 1 };
            mockPrisma.question.findUnique.mockResolvedValue(existing);
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);
            await expect(questionService.update(1, { questionnaire_id: 999 })).rejects.toThrow('Questionário não encontrado');
            expect(mockPrisma.question.update).not.toHaveBeenCalled();
        });
        it('deve lançar erro ao falhar', async () => {
            const existing = { id: 1, title: 'Q1', questionnaire_id: 1 };
            mockPrisma.question.findUnique.mockResolvedValue(existing);
            mockPrisma.question.update.mockRejectedValue(new Error('DB error'));
            await expect(questionService.update(1, { title: 'Q' })).rejects.toThrow('DB error');
        });
    });

    describe('delete', () => {
        it('deve deletar questão com sucesso', async () => {
            const existing = { id: 1, title: 'Q1', questionnaire_id: 1 };
            mockPrisma.question.findUnique.mockResolvedValue(existing);
            mockPrisma.question.delete.mockResolvedValue(existing);
            const result = await questionService.delete(1);
            expect(mockPrisma.question.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.question.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ message: 'Questão excluída com sucesso' });
        });
        it('deve lançar erro se questão não encontrada', async () => {
            mockPrisma.question.findUnique.mockResolvedValue(null);
            await expect(questionService.delete(999)).rejects.toThrow('Questão não encontrada');
            expect(mockPrisma.question.delete).not.toHaveBeenCalled();
        });
        it('deve lançar erro ao falhar', async () => {
            const existing = { id: 1, title: 'Q1', questionnaire_id: 1 };
            mockPrisma.question.findUnique.mockResolvedValue(existing);
            mockPrisma.question.delete.mockRejectedValue(new Error('DB error'));
            await expect(questionService.delete(1)).rejects.toThrow('DB error');
        });
    });
}); 