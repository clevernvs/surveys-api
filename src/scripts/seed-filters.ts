import prisma from '../prisma/client';

async function main() {
    console.log('🌱 Iniciando seed de filtros...');

    // Primeiro, vamos garantir que temos dados demográficos suficientes
    console.log('📊 Criando dados demográficos...');

    // Gêneros
    await Promise.all([
        prisma.gender.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: 'Masculino' }
        }),
        prisma.gender.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: 'Feminino' }
        }),
        prisma.gender.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: 'Não binário' }
        }),
        prisma.gender.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: 'Prefere não informar' }
        })
    ]);

    // Classes sociais
    await Promise.all([
        prisma.socialClass.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: 'A' }
        }),
        prisma.socialClass.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: 'B1' }
        }),
        prisma.socialClass.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: 'B2' }
        }),
        prisma.socialClass.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: 'C1' }
        }),
        prisma.socialClass.upsert({
            where: { id: 5 },
            update: {},
            create: { id: 5, value: 'C2' }
        }),
        prisma.socialClass.upsert({
            where: { id: 6 },
            update: {},
            create: { id: 6, value: 'D' }
        }),
        prisma.socialClass.upsert({
            where: { id: 7 },
            update: {},
            create: { id: 7, value: 'E' }
        })
    ]);

    // Faixas etárias
    await Promise.all([
        prisma.ageRange.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: '18-24 anos' }
        }),
        prisma.ageRange.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: '25-34 anos' }
        }),
        prisma.ageRange.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: '35-44 anos' }
        }),
        prisma.ageRange.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: '45-54 anos' }
        }),
        prisma.ageRange.upsert({
            where: { id: 5 },
            update: {},
            create: { id: 5, value: '55-64 anos' }
        }),
        prisma.ageRange.upsert({
            where: { id: 6 },
            update: {},
            create: { id: 6, value: '65+ anos' }
        })
    ]);

    // Países
    await Promise.all([
        prisma.country.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: 'Brasil' }
        }),
        prisma.country.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: 'Argentina' }
        }),
        prisma.country.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: 'Chile' }
        }),
        prisma.country.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: 'Colômbia' }
        }),
        prisma.country.upsert({
            where: { id: 5 },
            update: {},
            create: { id: 5, value: 'México' }
        })
    ]);

    // Estados brasileiros
    await Promise.all([
        prisma.state.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: 'SP' }
        }),
        prisma.state.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: 'RJ' }
        }),
        prisma.state.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: 'MG' }
        }),
        prisma.state.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: 'RS' }
        }),
        prisma.state.upsert({
            where: { id: 5 },
            update: {},
            create: { id: 5, value: 'PR' }
        }),
        prisma.state.upsert({
            where: { id: 6 },
            update: {},
            create: { id: 6, value: 'SC' }
        }),
        prisma.state.upsert({
            where: { id: 7 },
            update: {},
            create: { id: 7, value: 'BA' }
        }),
        prisma.state.upsert({
            where: { id: 8 },
            update: {},
            create: { id: 8, value: 'GO' }
        }),
        prisma.state.upsert({
            where: { id: 9 },
            update: {},
            create: { id: 9, value: 'PE' }
        }),
        prisma.state.upsert({
            where: { id: 10 },
            update: {},
            create: { id: 10, value: 'CE' }
        })
    ]);

    // Cidades
    await Promise.all([
        prisma.city.upsert({
            where: { id: 1 },
            update: {},
            create: { id: 1, value: 'São Paulo' }
        }),
        prisma.city.upsert({
            where: { id: 2 },
            update: {},
            create: { id: 2, value: 'Rio de Janeiro' }
        }),
        prisma.city.upsert({
            where: { id: 3 },
            update: {},
            create: { id: 3, value: 'Belo Horizonte' }
        }),
        prisma.city.upsert({
            where: { id: 4 },
            update: {},
            create: { id: 4, value: 'Porto Alegre' }
        }),
        prisma.city.upsert({
            where: { id: 5 },
            update: {},
            create: { id: 5, value: 'Curitiba' }
        }),
        prisma.city.upsert({
            where: { id: 6 },
            update: {},
            create: { id: 6, value: 'Florianópolis' }
        }),
        prisma.city.upsert({
            where: { id: 7 },
            update: {},
            create: { id: 7, value: 'Salvador' }
        }),
        prisma.city.upsert({
            where: { id: 8 },
            update: {},
            create: { id: 8, value: 'Goiânia' }
        }),
        prisma.city.upsert({
            where: { id: 9 },
            update: {},
            create: { id: 9, value: 'Recife' }
        }),
        prisma.city.upsert({
            where: { id: 10 },
            update: {},
            create: { id: 10, value: 'Fortaleza' }
        })
    ]);

    console.log('✅ Dados demográficos criados');

    // Agora vamos criar filtros variados
    console.log('🎯 Criando filtros...');

    const filters = await Promise.all([
        // Filtro 1: Jovens de São Paulo, classe A/B
        prisma.filter.upsert({
            where: { id: 1 },
            update: {},
            create: {
                id: 1,
                questionnaire_id: 1,
                gender_id: 1, // Masculino
                social_class_id: 1, // A
                age_range_id: 1, // 18-24 anos
                country_id: 1, // Brasil
                city_id: 1, // São Paulo
                state_id: 1, // SP
                quota_id: 1
            }
        }),

        // Filtro 2: Mulheres de 25-34 anos, classe B/C
        prisma.filter.upsert({
            where: { id: 2 },
            update: {},
            create: {
                id: 2,
                questionnaire_id: 1,
                gender_id: 2, // Feminino
                social_class_id: 3, // B2
                age_range_id: 2, // 25-34 anos
                country_id: 1, // Brasil
                city_id: 2, // Rio de Janeiro
                state_id: 2, // RJ
                quota_id: 2
            }
        }),

        // Filtro 3: Adultos 35-44 anos, classe C
        prisma.filter.upsert({
            where: { id: 3 },
            update: {},
            create: {
                id: 3,
                questionnaire_id: 1,
                gender_id: 4, // Prefere não informar
                social_class_id: 4, // C1
                age_range_id: 3, // 35-44 anos
                country_id: 1, // Brasil
                city_id: 3, // Belo Horizonte
                state_id: 3, // MG
                quota_id: 3
            }
        }),

        // Filtro 4: Pessoas 45-54 anos, classe B
        prisma.filter.upsert({
            where: { id: 4 },
            update: {},
            create: {
                id: 4,
                questionnaire_id: 1,
                gender_id: 2, // Feminino
                social_class_id: 2, // B1
                age_range_id: 4, // 45-54 anos
                country_id: 1, // Brasil
                city_id: 4, // Porto Alegre
                state_id: 4, // RS
                quota_id: 4
            }
        }),

        // Filtro 5: Jovens não binários, classe A
        prisma.filter.upsert({
            where: { id: 5 },
            update: {},
            create: {
                id: 5,
                questionnaire_id: 1,
                gender_id: 3, // Não binário
                social_class_id: 1, // A
                age_range_id: 1, // 18-24 anos
                country_id: 1, // Brasil
                city_id: 5, // Curitiba
                state_id: 5, // PR
                quota_id: 5
            }
        }),

        // Filtro 6: Adultos 55-64 anos, classe C
        prisma.filter.upsert({
            where: { id: 6 },
            update: {},
            create: {
                id: 6,
                questionnaire_id: 1,
                gender_id: 1, // Masculino
                social_class_id: 5, // C2
                age_range_id: 5, // 55-64 anos
                country_id: 1, // Brasil
                city_id: 6, // Florianópolis
                state_id: 6, // SC
                quota_id: 6
            }
        }),

        // Filtro 7: Mulheres 65+, classe B
        prisma.filter.upsert({
            where: { id: 7 },
            update: {},
            create: {
                id: 7,
                questionnaire_id: 1,
                gender_id: 2, // Feminino
                social_class_id: 2, // B1
                age_range_id: 6, // 65+ anos
                country_id: 1, // Brasil
                city_id: 7, // Salvador
                state_id: 7, // BA
                quota_id: 7
            }
        }),

        // Filtro 8: Homens 25-34 anos, classe D/E
        prisma.filter.upsert({
            where: { id: 8 },
            update: {},
            create: {
                id: 8,
                questionnaire_id: 1,
                gender_id: 1, // Masculino
                social_class_id: 6, // D
                age_range_id: 2, // 25-34 anos
                country_id: 1, // Brasil
                city_id: 8, // Goiânia
                state_id: 8, // GO
                quota_id: 8
            }
        }),

        // Filtro 9: Mulheres 35-44 anos, classe A
        prisma.filter.upsert({
            where: { id: 9 },
            update: {},
            create: {
                id: 9,
                questionnaire_id: 1,
                gender_id: 2, // Feminino
                social_class_id: 1, // A
                age_range_id: 3, // 35-44 anos
                country_id: 1, // Brasil
                city_id: 9, // Recife
                state_id: 9, // PE
                quota_id: 9
            }
        }),

        // Filtro 10: Pessoas 18-24 anos, classe C
        prisma.filter.upsert({
            where: { id: 10 },
            update: {},
            create: {
                id: 10,
                questionnaire_id: 1,
                gender_id: 4, // Prefere não informar
                social_class_id: 4, // C1
                age_range_id: 1, // 18-24 anos
                country_id: 1, // Brasil
                city_id: 10, // Fortaleza
                state_id: 10, // CE
                quota_id: 10
            }
        })
    ]);

    console.log('✅ Filtros criados:', filters.length);
    console.log('🎉 Seed de filtros concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed de filtros:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 