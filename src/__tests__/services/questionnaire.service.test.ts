import { mockPrisma } from '../mocks/prisma.mock';
import { QuestionnaireService } from '../../services/questionnaire.service';

// Mock do Prisma
jest.mock('../../prisma/client', () => mockPrisma);

describe('QuestionnaireService', () => {
    let questionnaireService: QuestionnaireService;

    beforeEach(() => {
        questionnaireService = new QuestionnaireService();
        Object.values(mockPrisma.questionnaire).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockClear();
            }
        });
        Object.values(mockPrisma.project).forEach((method) => {
            if (typeof method === 'function') {
                (method as jest.Mock).mockClear();
            }
        });
    });

    describe('findAll', () => {
        it('deve retornar todos os questionários', async () => {
            const mockQuestionnaires = [
                {
                    id: 1,
                    title: 'Questionário A',
                    project_id: 1,
                    project: { id: 1, title: 'Projeto A' },
                    sample_source: { id: 1, name: 'Fonte A' },
                    filters: []
                },
                {
                    id: 2,
                    title: 'Questionário B',
                    project_id: 2,
                    project: { id: 2, title: 'Projeto B' },
                    sample_source: { id: 1, name: 'Fonte A' },
                    filters: []
                }
            ];
            mockPrisma.questionnaire.findMany.mockResolvedValue(mockQuestionnaires);

            const result = await questionnaireService.findAll();

            expect(mockPrisma.questionnaire.findMany).toHaveBeenCalledWith({
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            expect(result).toEqual(mockQuestionnaires);
        });

        it('deve lançar erro quando falhar ao buscar questionários', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.questionnaire.findMany.mockRejectedValue(error);

            await expect(questionnaireService.findAll()).rejects.toThrow('Erro interno do servidor');
            expect(mockPrisma.questionnaire.findMany).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('deve retornar questionário por ID', async () => {
            const mockQuestionnaire = {
                id: 1,
                title: 'Questionário A',
                project_id: 1,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };
            mockPrisma.questionnaire.findUnique.mockResolvedValue(mockQuestionnaire);

            const result = await questionnaireService.findById(1);

            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
            expect(result).toEqual(mockQuestionnaire);
        });

        it('deve lançar erro quando questionário não encontrado', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(questionnaireService.findById(999)).rejects.toThrow('Questionário não encontrado');
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({
                where: { id: 999 },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
        });

        it('deve lançar erro quando falhar ao buscar questionário', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.questionnaire.findUnique.mockRejectedValue(error);

            await expect(questionnaireService.findById(1)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
        });
    });

    describe('create', () => {
        it('deve criar questionário com sucesso', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };
            const mockProject = { id: 1, title: 'Projeto A' };
            const mockCreatedQuestionnaire = {
                id: 1,
                ...questionnaireData,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31')
            };

            mockPrisma.project.findUnique.mockResolvedValue(mockProject);
            mockPrisma.questionnaire.create.mockResolvedValue(mockCreatedQuestionnaire);

            const result = await questionnaireService.create(questionnaireData);

            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.questionnaire.create).toHaveBeenCalledWith({
                data: {
                    title: 'Novo Questionário',
                    sample_source_id: 1,
                    goal: 100,
                    filter_id: 1,
                    randomized_questions: false,
                    status: 'DRAFT',
                    start_date: new Date('2024-01-01'),
                    end_date: new Date('2024-12-31'),
                    project_id: 1
                }
            });
            expect(result).toEqual(mockCreatedQuestionnaire);
        });

        it('deve lançar erro quando projeto não encontrado', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 999,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            mockPrisma.project.findUnique.mockResolvedValue(null);

            await expect(questionnaireService.create(questionnaireData)).rejects.toThrow('Projeto não encontrado');
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.questionnaire.create).not.toHaveBeenCalled();
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const questionnaireData = {
                title: 'Novo Questionário',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                randomized_questions: false,
                status: 'DRAFT',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };
            const mockProject = { id: 1, title: 'Projeto A' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.project.findUnique.mockResolvedValue(mockProject);
            mockPrisma.questionnaire.create.mockRejectedValue(error);

            await expect(questionnaireService.create(questionnaireData)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.questionnaire.create).toHaveBeenCalled();
        });
    });

    describe('update', () => {
        it('deve atualizar questionário com sucesso', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const updateData = {
                title: 'Questionário Atualizado',
                goal: 200
            };
            const mockUpdatedQuestionnaire = {
                ...existingQuestionnaire,
                ...updateData,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

            const result = await questionnaireService.update(1, updateData);

            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.questionnaire.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Questionário Atualizado',
                    sample_source_id: undefined,
                    goal: 200,
                    filter_id: undefined,
                    randomized_questions: undefined,
                    status: undefined,
                    start_date: undefined,
                    end_date: undefined,
                    project_id: undefined
                },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
            expect(result).toEqual(mockUpdatedQuestionnaire);
        });

        it('deve atualizar questionário com datas', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const updateData = {
                title: 'Questionário Atualizado',
                start_date: '2024-02-01',
                end_date: '2024-11-30'
            };
            const mockUpdatedQuestionnaire = {
                ...existingQuestionnaire,
                ...updateData,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

            const result = await questionnaireService.update(1, updateData);

            expect(mockPrisma.questionnaire.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    title: 'Questionário Atualizado',
                    sample_source_id: undefined,
                    goal: undefined,
                    filter_id: undefined,
                    randomized_questions: undefined,
                    status: undefined,
                    start_date: new Date('2024-02-01'),
                    end_date: new Date('2024-11-30'),
                    project_id: undefined
                },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
            expect(result).toEqual(mockUpdatedQuestionnaire);
        });

        it('deve lançar erro quando questionário não encontrado', async () => {
            const updateData = {
                title: 'Questionário Atualizado'
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(questionnaireService.update(999, updateData)).rejects.toThrow('Questionário não encontrado');
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.questionnaire.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro quando projeto não encontrado', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const updateData = {
                title: 'Questionário Atualizado',
                project_id: 999
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.project.findUnique.mockResolvedValue(null);

            await expect(questionnaireService.update(1, updateData)).rejects.toThrow('Projeto não encontrado');
            expect(mockPrisma.project.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.questionnaire.update).not.toHaveBeenCalled();
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const updateData = {
                title: 'Questionário Atualizado'
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.update.mockRejectedValue(error);

            await expect(questionnaireService.update(1, updateData)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.questionnaire.update).toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('deve deletar questionário com sucesso', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário para Deletar',
                project_id: 1
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.delete.mockResolvedValue(existingQuestionnaire);

            const result = await questionnaireService.delete(1);

            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.questionnaire.delete).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual({ message: 'Questionário deletado com sucesso' });
        });

        it('deve lançar erro quando questionário não encontrado', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);

            await expect(questionnaireService.delete(999)).rejects.toThrow('Questionário não encontrado');
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
            expect(mockPrisma.questionnaire.delete).not.toHaveBeenCalled();
        });

        it('deve lançar erro genérico quando falhar', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário para Deletar',
                project_id: 1
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.delete.mockRejectedValue(error);

            await expect(questionnaireService.delete(1)).rejects.toThrow('Erro de banco de dados');
            expect(mockPrisma.questionnaire.delete).toHaveBeenCalled();
        });
    });
}); 