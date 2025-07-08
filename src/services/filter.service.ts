import prisma from '../prisma/client';

export class FilterService {
    async findAll() {
        try {
            console.log('Iniciando busca de filtros...');
            const filters = await prisma.filter.findMany({
                orderBy: {
                    created_at: 'desc'
                }
            });
            console.log('Filtros encontrados:', filters.length);
            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros (detalhado):', error);
            throw error; // Deixa o erro real subir para o controller
        }
    }

    async findById(id: number) {
        try {
            const filter = await prisma.filter.findUnique({
                where: { id },
                include: {
                    questionnaire: true,
                    gender: true,
                    social_class: true,
                    age_range: true,
                    country: true,
                    city: true,
                    state: true
                }
            });

            if (!filter) {
                throw new Error('Filtro não encontrado');
            }

            return filter;
        } catch (error) {
            throw error;
        }
    }

    async create(data: any) {
        try {
            // Verificar se o questionário existe
            const questionnaire = await prisma.questionnaire.findUnique({
                where: { id: data.questionnaire_id }
            });
            if (!questionnaire) {
                throw new Error('Questionário não encontrado');
            }

            const filter = await prisma.filter.create({
                data: {
                    questionnaire_id: data.questionnaire_id,
                    gender_id: data.gender_id,
                    social_class_id: data.social_class_id,
                    age_range_id: data.age_range_id,
                    country_id: data.country_id,
                    city_id: data.city_id,
                    state_id: data.state_id,
                    quota_id: data.quota_id
                },
                include: {
                    questionnaire: true,
                    gender: true,
                    social_class: true,
                    age_range: true,
                    country: true,
                    city: true,
                    state: true
                }
            });

            return filter;
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            // Verificar se o filtro existe
            const existingFilter = await prisma.filter.findUnique({
                where: { id }
            });
            if (!existingFilter) {
                throw new Error('Filtro não encontrado');
            }

            const filter = await prisma.filter.update({
                where: { id },
                data: {
                    questionnaire_id: data.questionnaire_id,
                    gender_id: data.gender_id,
                    social_class_id: data.social_class_id,
                    age_range_id: data.age_range_id,
                    country_id: data.country_id,
                    city_id: data.city_id,
                    state_id: data.state_id,
                    quota_id: data.quota_id
                },
                include: {
                    questionnaire: true,
                    gender: true,
                    social_class: true,
                    age_range: true,
                    country: true,
                    city: true,
                    state: true
                }
            });

            return filter;
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number) {
        try {
            // Verificar se o filtro existe
            const existingFilter = await prisma.filter.findUnique({
                where: { id }
            });
            if (!existingFilter) {
                throw new Error('Filtro não encontrado');
            }

            await prisma.filter.delete({
                where: { id }
            });

            return { message: 'Filtro deletado com sucesso' };
        } catch (error) {
            throw error;
        }
    }

    async findByQuestionnaireId(questionnaireId: number) {
        try {
            const filters = await prisma.filter.findMany({
                where: { questionnaire_id: questionnaireId },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros por questionário:', error);
            throw error;
        }
    }

    async findByGender(genderId: number) {
        try {
            const filters = await prisma.filter.findMany({
                where: { gender_id: genderId },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros por gênero:', error);
            throw error;
        }
    }

    async findByAgeRange(ageRangeId: number) {
        try {
            const filters = await prisma.filter.findMany({
                where: { age_range_id: ageRangeId },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros por faixa etária:', error);
            throw error;
        }
    }

    async findBySocialClass(socialClassId: number) {
        try {
            const filters = await prisma.filter.findMany({
                where: { social_class_id: socialClassId },
                orderBy: {
                    created_at: 'desc'
                }
            });

            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros por classe social:', error);
            throw error;
        }
    }

    async findByLocation(countryId: number, stateId?: number, cityId?: number) {
        try {
            const whereCondition: any = { country_id: countryId };

            if (stateId) {
                whereCondition.state_id = stateId;
            }

            if (cityId) {
                whereCondition.city_id = cityId;
            }

            const filters = await prisma.filter.findMany({
                where: whereCondition,
                orderBy: {
                    created_at: 'desc'
                }
            });

            return filters;
        } catch (error) {
            console.error('Erro ao buscar filtros por localização:', error);
            throw error;
        }
    }
} 