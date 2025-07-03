import prisma from '../prisma/client';

async function seedProjectTypes() {
    try {
        console.log('🌱 Iniciando seed de ProjectTypes...');

        const projectTypes = [
            {
                name: 'Pesquisa Quantitativa',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Qualitativa',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Mista',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Estudo Longitudinal',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Estudo Transversal',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Experimental',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Observacional',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Estudo de Caso',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa de Campo',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Laboratorial',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Documental',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Pesquisa Participativa',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const projectType of projectTypes) {
            const existingProjectType = await prisma.projectType.findFirst({
                where: { name: projectType.name }
            });

            if (!existingProjectType) {
                const createdProjectType = await prisma.projectType.create({
                    data: projectType
                });
                console.log(`✅ ProjectType criado: ${createdProjectType.name} - ID: ${createdProjectType.id}`);
            } else {
                console.log(`⏭️ ProjectType já existe: ${existingProjectType.name} - ID: ${existingProjectType.id}`);
            }
        }

        console.log('🎉 Seed de ProjectTypes concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de ProjectTypes:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedProjectTypes()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedProjectTypes; 