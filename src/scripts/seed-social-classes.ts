import prisma from '../prisma/client';

async function seedSocialClasses() {
    try {
        console.log('🌱 Iniciando seed de SocialClasses...');

        const socialClasses = [
            {
                name: 'Classe A',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe B',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe C',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe D',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe E',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Alta Renda',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Média Renda',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Baixa Renda',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Elite',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe Média Alta',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe Média',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe Média Baixa',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe Trabalhadora',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Classe Baixa',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Prefiro não informar',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const socialClass of socialClasses) {
            const existingSocialClass = await prisma.socialClass.findFirst({
                where: { name: socialClass.name }
            });

            if (!existingSocialClass) {
                const createdSocialClass = await prisma.socialClass.create({
                    data: socialClass
                });
                console.log(`✅ SocialClass criada: ${createdSocialClass.name} - ID: ${createdSocialClass.id}`);
            } else {
                console.log(`⏭️ SocialClass já existe: ${existingSocialClass.name} - ID: ${existingSocialClass.id}`);
            }
        }

        console.log('🎉 Seed de SocialClasses concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de SocialClasses:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedSocialClasses()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedSocialClasses; 