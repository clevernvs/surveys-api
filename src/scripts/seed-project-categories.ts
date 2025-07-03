import prisma from '../prisma/client';

async function seedProjectCategories() {
    try {
        console.log('🌱 Iniciando seed de ProjectCategories...');

        const projectCategories = [
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

        for (const projectCategory of projectCategories) {
            const existingProjectCategory = await prisma.projectCategory.findFirst({
                where: { name: projectCategory.name }
            });

            if (!existingProjectCategory) {
                const createdProjectCategory = await prisma.projectCategory.create({
                    data: projectCategory
                });
                console.log(`✅ ProjectCategory criada: ${createdProjectCategory.name} - ID: ${createdProjectCategory.id}`);
            } else {
                console.log(`⏭️ ProjectCategory já existe: ${existingProjectCategory.name} - ID: ${existingProjectCategory.id}`);
            }
        }

        console.log('🎉 Seed de ProjectCategories concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de ProjectCategories:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedProjectCategories()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedProjectCategories; 