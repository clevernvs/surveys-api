import prisma from '../prisma/client';

async function seedQuestionTypes() {
    try {
        console.log('🌱 Iniciando seed de QuestionTypes...');

        const questionTypes = [
            {
                name: 'Text',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Open Text',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Single Answer',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Select',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Multi Answer',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Scale',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Symbol',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Ranking',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Grid',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Grid Column',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Grid Line',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Information',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'File Upload',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Block',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'NPS',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const questionType of questionTypes) {
            const existingQuestionType = await prisma.questionType.findFirst({
                where: { name: questionType.name }
            });

            if (!existingQuestionType) {
                const createdQuestionType = await prisma.questionType.create({
                    data: questionType
                });
                console.log(`✅ QuestionType criado: ${createdQuestionType.name} (ID: ${createdQuestionType.id})`);
            } else {
                console.log(`⏭️ QuestionType já existe: ${existingQuestionType.name} (ID: ${existingQuestionType.id})`);
            }
        }

        console.log('🎉 Seed de QuestionTypes concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de QuestionTypes:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedQuestionTypes()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedQuestionTypes; 