import prisma from '../prisma/client';

async function seedGenders() {
    try {
        console.log('🌱 Iniciando seed de Genders...');

        const genders = [
            {
                name: 'Masculino',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Feminino',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Não Binário',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Transgênero',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Intersexo',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Prefiro não informar',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Outro',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const gender of genders) {
            const existingGender = await prisma.gender.findFirst({
                where: { name: gender.name }
            });

            if (!existingGender) {
                const createdGender = await prisma.gender.create({
                    data: gender
                });
                console.log(`✅ Gender criado: ${createdGender.name} - ID: ${createdGender.id}`);
            } else {
                console.log(`⏭️ Gender já existe: ${existingGender.name} - ID: ${existingGender.id}`);
            }
        }

        console.log('🎉 Seed de Genders concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de Genders:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedGenders()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedGenders; 