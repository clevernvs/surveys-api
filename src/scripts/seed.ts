import prisma from '../prisma/client';

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar clientes
    const client1 = await prisma.client.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Cliente Exemplo 1',
            email: 'cliente1@exemplo.com'
        }
    });
    const client2 = await prisma.client.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            name: 'Cliente Exemplo 2',
            email: 'cliente2@exemplo.com'
        }
    });
    console.log('✅ Clientes criados:', { client1, client2 });

    // Criar idiomas
    const language = await prisma.language.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Português',
            code: 'pt-BR'
        }
    });
    console.log('✅ Idioma criado:', language);

    // Criar comunidade
    const community = await prisma.community.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Comunidade Exemplo',
            status: 'ACTIVE'
        }
    });
    console.log('✅ Comunidade criada:', community);

    // Criar SampleSource
    const sampleSource = await prisma.sampleSource.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Fonte de Amostra Exemplo'
        }
    });
    console.log('✅ SampleSource criado:', sampleSource);

    // Criar dados demográficos
    await prisma.gender.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: 'Masculino'
        }
    });
    await prisma.socialClass.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: 'A'
        }
    });
    await prisma.ageRange.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: '18-24'
        }
    });
    await prisma.country.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: 'Brasil'
        }
    });
    await prisma.state.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: 'SP'
        }
    });
    await prisma.city.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            value: 'São Paulo'
        }
    });
    console.log('✅ Dados demográficos criados');

    // Criar Project
    const project = await prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            client_id: 1,
            language_id: 1,
            project_type: 'MARKET_RESEARCH',
            category: 'MARKET_RESEARCH',
            community_id: 1,
            sample_source_id: 1,
            status: 'ACTIVE',
            title: 'Projeto Exemplo',
            description: 'Descrição do projeto exemplo',
            sample_size: 1000
        }
    });
    console.log('✅ Projeto criado:', project);

    // Criar Questionnaire
    const questionnaire = await prisma.questionnaire.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            project_id: 1,
            sample_source_id: 1,
            title: 'Questionário Exemplo',
            goal: 100,
            filter_id: 1,
            randomized_questions: false,
            status: 'ACTIVE',
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-12-31')
        }
    });
    console.log('✅ Questionário criado:', questionnaire);

    // Criar Question
    const question = await prisma.question.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            questionnaire_id: 1,
            question_type: 'SINGLE_CHOICE',
            title: 'Qual sua cor favorita?',
            required: true,
            randomize_answers: false,
            order_index: 1
        }
    });
    console.log('✅ Questão criada:', question);

    // Criar Answer
    const answer1 = await prisma.answer.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            question_id: 1,
            answer_type: 'SINGLE_CHOICE',
            value: 'Azul',
            fixed: false,
            order_index: 1
        }
    });
    const answer2 = await prisma.answer.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            question_id: 1,
            answer_type: 'SINGLE_CHOICE',
            value: 'Verde',
            fixed: false,
            order_index: 2
        }
    });
    console.log('✅ Respostas criadas:', { answer1, answer2 });

    console.log('🎉 Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro durante o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 