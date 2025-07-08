import { mockPrisma } from '../mocks/prisma.mock';
jest.mock('../../prisma/client', () => mockPrisma);
import request from 'supertest';
import app from '../../app';

describe('Filter Routes', () => {
    const nowISOString = new Date('2025-07-08T02:25:54.433Z').toISOString();
    const validFilterData = {
        questionnaire_id: 1,
        gender_id: 1,
        social_class_id: 1,
        age_range_id: 1,
        country_id: 1,
        city_id: 1,
        state_id: 1,
        quota_id: 1
    };

    const mockFilter = {
        id: 1,
        ...validFilterData,
        created_at: nowISOString,
        updated_at: nowISOString
    };

    const mockFilterWithRelations = {
        ...mockFilter,
        questionnaire: { id: 1, title: 'Questionário Teste' },
        gender: { id: 1, name: 'Masculino' },
        social_class: { id: 1, name: 'Classe A' },
        age_range: { id: 1, name: '18-25' },
        country: { id: 1, name: 'Brasil' },
        city: { id: 1, name: 'São Paulo' },
        state: { id: 1, name: 'SP' }
    };

    describe('GET /filters', () => {
        it('deve retornar todos os filtros', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar filtros',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/:id', () => {
        it('deve retornar filtro por ID', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilterWithRelations);

            const response = await request(app).get('/api/v2/filters/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilterWithRelations,
                message: 'Filtro encontrado com sucesso'
            });
        });

        it('deve retornar erro 404 se não encontrar', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(null);

            const response = await request(app).get('/api/v2/filters/999').expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Filtro não encontrado',
                message: 'O filtro especificado não existe'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/filters/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findUnique.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao buscar filtro',
                message: 'DB error'
            });
        });
    });

    describe('POST /filters', () => {
        it('deve criar filtro com sucesso', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue({ id: 1, title: 'Questionário Teste' });
            mockPrisma.filter.create.mockResolvedValue(mockFilterWithRelations);

            const response = await request(app).post('/api/v2/filters').send(validFilterData).expect(201);

            expect(response.body).toEqual({
                success: true,
                data: mockFilterWithRelations,
                message: 'Filtro criado com sucesso'
            });
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const invalidData = { ...validFilterData, questionnaire_id: 'invalid' };

            const response = await request(app).post('/api/v2/filters').send(invalidData).expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 404 se questionário não existe', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue(null);

            const response = await request(app).post('/api/v2/filters').send(validFilterData).expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.questionnaire.findUnique.mockResolvedValue({ id: 1, title: 'Questionário Teste' });
            mockPrisma.filter.create.mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/api/v2/filters').send(validFilterData).expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao criar filtro',
                message: 'DB error'
            });
        });
    });

    describe('PUT /filters/:id', () => {
        const updateData = { gender_id: 2 };

        it('deve atualizar filtro com sucesso', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilter);
            mockPrisma.filter.update.mockResolvedValue({ ...mockFilterWithRelations, ...updateData });

            const response = await request(app).put('/api/v2/filters/1').send(updateData).expect(200);

            expect(response.body).toEqual({
                success: true,
                data: { ...mockFilterWithRelations, ...updateData },
                message: 'Filtro atualizado com sucesso'
            });
        });

        it('deve retornar erro 404 se filtro não encontrado', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(null);

            const response = await request(app).put('/api/v2/filters/999').send(updateData).expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Filtro não encontrado',
                message: 'O filtro especificado não existe'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).put('/api/v2/filters/invalid').send(updateData).expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 400 para dados inválidos', async () => {
            const invalidData = { questionnaire_id: 'invalid' };

            const response = await request(app).put('/api/v2/filters/1').send(invalidData).expect(400);

            expect(response.body).toHaveProperty('error');
        });

        it('deve retornar erro 404 se questionário não existe', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilter);
            mockPrisma.filter.update.mockRejectedValue(new Error('Questionário não encontrado'));

            const response = await request(app).put('/api/v2/filters/1').send({ questionnaire_id: 999 }).expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilter);
            mockPrisma.filter.update.mockRejectedValue(new Error('DB error'));

            const response = await request(app).put('/api/v2/filters/1').send(updateData).expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao atualizar filtro',
                message: 'DB error'
            });
        });
    });

    describe('DELETE /filters/:id', () => {
        it('deve deletar filtro com sucesso', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilter);
            mockPrisma.filter.delete.mockResolvedValue(mockFilter);

            const response = await request(app).delete('/api/v2/filters/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                message: 'Filtro deletado com sucesso'
            });
        });

        it('deve retornar erro 404 se filtro não encontrado', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(null);

            const response = await request(app).delete('/api/v2/filters/999').expect(404);

            expect(response.body).toEqual({
                success: false,
                error: 'Filtro não encontrado',
                message: 'O filtro especificado não existe'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).delete('/api/v2/filters/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findUnique.mockResolvedValue(mockFilter);
            mockPrisma.filter.delete.mockRejectedValue(new Error('DB error'));

            const response = await request(app).delete('/api/v2/filters/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro interno do servidor ao deletar filtro',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/questionnaire/:questionnaireId', () => {
        it('deve retornar filtros por questionário', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/questionnaire/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/filters/questionnaire/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID do questionário inválido',
                message: 'O ID do questionário deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/questionnaire/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro ao buscar filtros por questionário',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/gender/:genderId', () => {
        it('deve retornar filtros por gênero', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/gender/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/filters/gender/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID do gênero inválido',
                message: 'O ID do gênero deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/gender/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro ao buscar filtros por gênero',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/age-range/:ageRangeId', () => {
        it('deve retornar filtros por faixa etária', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/age-range/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/filters/age-range/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID da faixa etária inválido',
                message: 'O ID da faixa etária deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/age-range/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro ao buscar filtros por faixa etária',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/social-class/:socialClassId', () => {
        it('deve retornar filtros por classe social', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/social-class/1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 400 para ID inválido', async () => {
            const response = await request(app).get('/api/v2/filters/social-class/invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID da classe social inválido',
                message: 'O ID da classe social deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/social-class/1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro ao buscar filtros por classe social',
                message: 'DB error'
            });
        });
    });

    describe('GET /filters/location', () => {
        it('deve retornar filtros por localização (apenas país)', async () => {
            const mockFilters = [mockFilter, { ...mockFilter, id: 2 }];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/location?countryId=1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar filtros por localização (país e estado)', async () => {
            const mockFilters = [mockFilter];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/location?countryId=1&stateId=1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar filtros por localização (país, estado e cidade)', async () => {
            const mockFilters = [mockFilter];
            mockPrisma.filter.findMany.mockResolvedValue(mockFilters);

            const response = await request(app).get('/api/v2/filters/location?countryId=1&stateId=1&cityId=1').expect(200);

            expect(response.body).toEqual({
                success: true,
                data: mockFilters,
                message: 'Filtros encontrados com sucesso'
            });
        });

        it('deve retornar erro 400 para countryId inválido', async () => {
            const response = await request(app).get('/api/v2/filters/location?countryId=invalid').expect(400);

            expect(response.body).toEqual({
                success: false,
                error: 'ID do país inválido',
                message: 'O ID do país deve ser um número válido'
            });
        });

        it('deve retornar erro 500 ao falhar', async () => {
            mockPrisma.filter.findMany.mockRejectedValue(new Error('DB error'));

            const response = await request(app).get('/api/v2/filters/location?countryId=1').expect(500);

            expect(response.body).toEqual({
                success: false,
                error: 'Erro ao buscar filtros por localização',
                message: 'DB error'
            });
        });
    });
}); 