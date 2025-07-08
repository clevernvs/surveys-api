import { mockPrisma } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import request from 'supertest';
import app from '../../app';

describe('Questionnaire Routes', () => {
    beforeEach(() => {
        // Limpar todos os mocks antes de cada teste
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

    describe('GET /questionnaires', () => {
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

            const response = await request(app)
                .get('/api/v2/questionnaires')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockQuestionnaires,
                message: 'Questionários encontrados com sucesso'
            });
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
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.questionnaire.findMany.mockRejectedValue(error);

            const response = await request(app)
                .get('/api/v2/questionnaires')
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar questionários',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('GET /questionnaires/:id', () => {
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

            const response = await request(app)
                .get('/api/v2/questionnaires/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockQuestionnaire,
                message: 'Questionário encontrado com sucesso'
            });
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    project: true,
                    sample_source: true,
                    filters: true
                }
            });
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            const error = new Error('Questionário não encontrado');
            mockPrisma.questionnaire.findUnique.mockRejectedValue(error);

            const response = await request(app)
                .get('/api/v2/questionnaires/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .get('/api/v2/questionnaires/abc')
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const error = new Error('Erro de banco de dados');
            mockPrisma.questionnaire.findUnique.mockRejectedValue(error);

            const response = await request(app)
                .get('/api/v2/questionnaires/1')
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('POST /questionnaires', () => {
        const validQuestionnaireData = {
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

        it('deve criar questionário com sucesso', async () => {
            const mockProject = { id: 1, title: 'Projeto A' };
            const mockCreatedQuestionnaire = {
                id: 1,
                ...validQuestionnaireData,
                start_date: new Date('2024-01-01'),
                end_date: new Date('2024-12-31')
            };

            mockPrisma.project.findUnique.mockResolvedValue(mockProject);
            mockPrisma.questionnaire.create.mockResolvedValue(mockCreatedQuestionnaire);

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(validQuestionnaireData)
                .expect(201);

            expect(response.body).toEqual({
                success: true,
                data: mockCreatedQuestionnaire,
                message: 'Questionário criado com sucesso'
            });
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
        });

        it('deve retornar erro 400 quando título estiver vazio', async () => {
            const invalidData = { ...validQuestionnaireData, title: '' };

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando project_id não for fornecido', async () => {
            const { project_id, ...invalidData } = validQuestionnaireData;

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando goal não for fornecido', async () => {
            const { goal, ...invalidData } = validQuestionnaireData;

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando start_date não for fornecido', async () => {
            const { start_date, ...invalidData } = validQuestionnaireData;

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando end_date não for fornecido', async () => {
            const { end_date, ...invalidData } = validQuestionnaireData;

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 400 quando end_date é anterior a start_date', async () => {
            const invalidData = {
                ...validQuestionnaireData,
                start_date: '2024-12-31',
                end_date: '2024-01-01'
            };

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(invalidData)
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            mockPrisma.project.findUnique.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(validQuestionnaireData)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Projeto não encontrado',
                message: 'O projeto especificado não existe'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const mockProject = { id: 1, title: 'Projeto A' };
            const error = new Error('Erro de banco de dados');

            mockPrisma.project.findUnique.mockResolvedValue(mockProject);
            mockPrisma.questionnaire.create.mockRejectedValue(error);

            const response = await request(app)
                .post('/api/v2/questionnaires')
                .send(validQuestionnaireData)
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao criar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('PUT /questionnaires/:id', () => {
        const validUpdateData = {
            title: 'Questionário Atualizado',
            goal: 200
        };

        it('deve atualizar questionário com sucesso', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const mockUpdatedQuestionnaire = {
                ...existingQuestionnaire,
                ...validUpdateData,
                project: { id: 1, title: 'Projeto A' },
                sample_source: { id: 1, name: 'Fonte A' },
                filters: []
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.update.mockResolvedValue(mockUpdatedQuestionnaire);

            const response = await request(app)
                .put('/api/v2/questionnaires/1')
                .send(validUpdateData)
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockUpdatedQuestionnaire,
                message: 'Questionário atualizado com sucesso'
            });
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
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            const error = new Error('Questionário não encontrado');
            mockPrisma.questionnaire.findUnique.mockRejectedValue(error);

            const response = await request(app)
                .put('/api/v2/questionnaires/999')
                .send(validUpdateData)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .put('/api/v2/questionnaires/abc')
                .send(validUpdateData)
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 404 quando projeto não encontrado', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const updateDataWithProject = {
                ...validUpdateData,
                project_id: 999
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            const error = new Error('Projeto não encontrado');
            mockPrisma.questionnaire.update.mockRejectedValue(error);

            const response = await request(app)
                .put('/api/v2/questionnaires/1')
                .send(updateDataWithProject)
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Projeto não encontrado',
                message: 'O projeto especificado não existe'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário Antigo',
                project_id: 1
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.update.mockRejectedValue(error);

            const response = await request(app)
                .put('/api/v2/questionnaires/1')
                .send(validUpdateData)
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao atualizar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });

    describe('DELETE /questionnaires/:id', () => {
        it('deve deletar questionário com sucesso', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário para Deletar',
                project_id: 1
            };

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.delete.mockResolvedValue(existingQuestionnaire);

            const response = await request(app)
                .delete('/api/v2/questionnaires/1')
                .expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Questionário deletado com sucesso'
            });
            expect(mockPrisma.questionnaire.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(mockPrisma.questionnaire.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('deve retornar erro 404 quando questionário não encontrado', async () => {
            const error = new Error('Questionário não encontrado');
            mockPrisma.questionnaire.findUnique.mockRejectedValue(error);

            const response = await request(app)
                .delete('/api/v2/questionnaires/999')
                .expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 400 quando ID inválido', async () => {
            const response = await request(app)
                .delete('/api/v2/questionnaires/abc')
                .expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 500 quando falhar', async () => {
            const existingQuestionnaire = {
                id: 1,
                title: 'Questionário para Deletar',
                project_id: 1
            };
            const error = new Error('Erro de banco de dados');

            mockPrisma.questionnaire.findUnique.mockResolvedValue(existingQuestionnaire);
            mockPrisma.questionnaire.delete.mockRejectedValue(error);

            const response = await request(app)
                .delete('/api/v2/questionnaires/1')
                .expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao deletar questionário',
                message: 'Erro de banco de dados'
            });
        });
    });
}); 