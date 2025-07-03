import prisma from '../prisma/client';

async function seedCategories() {
    try {
        console.log('🌱 Iniciando seed de Categories...');

        const categories = [
            {
                name: 'Pesquisa de Mercado',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Satisfação do Cliente',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Engajamento de Funcionários',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Acadêmica',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Avaliação de Produto',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Feedback de Serviço',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Política',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Estudo de Comportamento',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Avaliação de Treinamento',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa de Saúde',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Avaliação de Eventos',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa de Opinião',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const category of categories) {
            const existingCategory = await prisma.category.findFirst({
                where: { name: category.name }
            });

            if (!existingCategory) {
                const createdCategory = await prisma.category.create({
                    data: category
                });
                console.log(`✅ Category criada: ${createdCategory.name} - ID: ${createdCategory.id}`);
            } else {
                console.log(`⏭️ Category já existe: ${existingCategory.name} - ID: ${existingCategory.id}`);
            }
        }

        console.log('🎉 Seed de Categories concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de Categories:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedCategories()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedCategories; 