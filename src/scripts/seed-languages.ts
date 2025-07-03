import prisma from '../prisma/client';

async function seedLanguages() {
    try {
        console.log('🌱 Iniciando seed de Languages...');

        const languages = [
            {
                name: 'Português',
                code: 'pt-BR',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'English',
                code: 'en-US',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Español',
                code: 'es-ES',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Français',
                code: 'fr-FR',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Deutsch',
                code: 'de-DE',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Italiano',
                code: 'it-IT',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: '日本語',
                code: 'ja-JP',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: '한국어',
                code: 'ko-KR',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: '中文',
                code: 'zh-CN',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: 'Русский',
                code: 'ru-RU',
                created_at: new Date(),
                updated_at: new Date()
            }
        ];

        for (const language of languages) {
            const existingLanguage = await prisma.language.findFirst({
                where: { code: language.code }
            });

            if (!existingLanguage) {
                const createdLanguage = await prisma.language.create({
                    data: language
                });
                console.log(`✅ Language criado: ${createdLanguage.name} (${createdLanguage.code}) - ID: ${createdLanguage.id}`);
            } else {
                console.log(`⏭️ Language já existe: ${existingLanguage.name} (${existingLanguage.code}) - ID: ${existingLanguage.id}`);
            }
        }

        console.log('🎉 Seed de Languages concluído com sucesso!');
    } catch (error) {
        console.error('❌ Erro durante o seed de Languages:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
    seedLanguages()
        .then(() => {
            console.log('✅ Seed executado com sucesso!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erro ao executar seed:', error);
            process.exit(1);
        });
}

export default seedLanguages; 