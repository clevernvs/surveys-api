import prisma from '../prisma/client';

async function createTestData() {
    try {
        console.log('🌱 Criando dados de teste...');

        // Criar empresa
        const company = await prisma.company.create({
            data: {
                name: 'Empresa Teste'
            }
        });
        console.log('✅ Empresa criada:', company);

        // Criar projeto
        const project = await prisma.project.create({
            data: {
                title: 'Projeto Teste',
                description: 'Descrição do projeto teste',
                project_type_id: 1,
                language_id: 1,
                category_id: 1,
                sample_source_id: 1,
                community_id: 1,
                status_id: 1,
                sample_size: 100,
                start_date: new Date(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
                company_id: company.id
            }
        });
        console.log('✅ Projeto criado:', project);

        // Criar questionário
        const questionnaire = await prisma.questionnaire.create({
            data: {
                title: 'Questionário de Teste',
                filter_id: 1,
                randomized_answers: false,
                status_id: 1,
                project_id: project.id
            }
        });
        console.log('✅ Questionário criado:', questionnaire);

        console.log('🎉 Dados de teste criados com sucesso!');
        console.log('ID do projeto criado:', project.id);

    } catch (error) {
        console.error('❌ Erro ao criar dados de teste:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestData(); 