import prisma from '../prisma/client';

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Criar empresas de exemplo
    const company1 = await prisma.company.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            name: 'Empresa Teste 1'
        }
    });

    const company2 = await prisma.company.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            name: 'Empresa Teste 2'
        }
    });

    console.log('✅ Empresas criadas:', { company1, company2 });

    // Criar projetos de exemplo
    const project1 = await prisma.project.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            title: 'Projeto de Pesquisa de Mercado',
            description: 'Pesquisa sobre preferências de consumidores',
            project_type_id: 1,
            language_id: 1,
            category_id: 1,
            sample_source_id: 1,
            community_id: 1,
            status: true,
            sample_size: 500,
            start_date: new Date('2025-01-01'),
            end_date: new Date('2025-12-31'),
            company_id: 1
        }
    });

    const project2 = await prisma.project.upsert({
        where: { id: 2 },
        update: {},
        create: {
            id: 2,
            title: 'Estudo de Satisfação do Cliente',
            description: 'Avaliação da satisfação dos clientes com nossos produtos',
            project_type_id: 2,
            language_id: 1,
            category_id: 2,
            sample_source_id: 2,
            community_id: 2,
            status: true,
            sample_size: 1000,
            start_date: new Date('2025-02-01'),
            end_date: new Date('2025-11-30'),
            company_id: 2
        }
    });

    console.log('✅ Projetos criados:', { project1, project2 });
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