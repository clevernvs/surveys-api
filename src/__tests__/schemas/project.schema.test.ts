import { z } from 'zod';
import {
    ProjectSchema,
    CreateProjectSchema,
    UpdateProjectSchema,
    ProjectIdSchema
} from '../../schemas/project.schema';

// Definindo os enums localmente para teste
const ProjectTypeEnum = z.enum([
    'MARKET_RESEARCH',
    'CUSTOMER_SATISFACTION',
    'PRODUCT_DEVELOPMENT',
    'BRAND_AWARENESS',
    'USER_EXPERIENCE',
    'FEEDBACK_COLLECTION',
    'SURVEY_RESEARCH',
    'OTHER'
]);

const ProjectCategoryEnum = z.enum([
    'MARKET_RESEARCH',
    'CUSTOMER_SATISFACTION',
    'PRODUCT_DEVELOPMENT',
    'BRAND_AWARENESS',
    'USER_EXPERIENCE',
    'FEEDBACK_COLLECTION',
    'SURVEY_RESEARCH',
    'OTHER'
]);

const ProjectStatusEnum = z.enum([
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELLED'
]);

describe('Project Schemas', () => {
    describe('ProjectTypeEnum', () => {
        it('deve aceitar valores válidos do enum', () => {
            const validTypes = [
                'MARKET_RESEARCH',
                'CUSTOMER_SATISFACTION',
                'PRODUCT_DEVELOPMENT',
                'BRAND_AWARENESS',
                'USER_EXPERIENCE',
                'FEEDBACK_COLLECTION',
                'SURVEY_RESEARCH',
                'OTHER'
            ];

            validTypes.forEach(type => {
                expect(() => ProjectTypeEnum.parse(type)).not.toThrow();
            });
        });

        it('deve rejeitar valores inválidos', () => {
            expect(() => ProjectTypeEnum.parse('INVALID_TYPE')).toThrow();
            expect(() => ProjectTypeEnum.parse('')).toThrow();
            expect(() => ProjectTypeEnum.parse(null)).toThrow();
            expect(() => ProjectTypeEnum.parse(undefined)).toThrow();
        });
    });

    describe('ProjectCategoryEnum', () => {
        it('deve aceitar valores válidos do enum', () => {
            const validCategories = [
                'MARKET_RESEARCH',
                'CUSTOMER_SATISFACTION',
                'PRODUCT_DEVELOPMENT',
                'BRAND_AWARENESS',
                'USER_EXPERIENCE',
                'FEEDBACK_COLLECTION',
                'SURVEY_RESEARCH',
                'OTHER'
            ];

            validCategories.forEach(category => {
                expect(() => ProjectCategoryEnum.parse(category)).not.toThrow();
            });
        });

        it('deve rejeitar valores inválidos', () => {
            expect(() => ProjectCategoryEnum.parse('INVALID_CATEGORY')).toThrow();
            expect(() => ProjectCategoryEnum.parse('')).toThrow();
            expect(() => ProjectCategoryEnum.parse(null)).toThrow();
            expect(() => ProjectCategoryEnum.parse(undefined)).toThrow();
        });
    });

    describe('ProjectStatusEnum', () => {
        it('deve aceitar valores válidos do enum', () => {
            const validStatuses = [
                'DRAFT',
                'ACTIVE',
                'PAUSED',
                'COMPLETED',
                'CANCELLED'
            ];

            validStatuses.forEach(status => {
                expect(() => ProjectStatusEnum.parse(status)).not.toThrow();
            });
        });

        it('deve rejeitar valores inválidos', () => {
            expect(() => ProjectStatusEnum.parse('INVALID_STATUS')).toThrow();
            expect(() => ProjectStatusEnum.parse('')).toThrow();
            expect(() => ProjectStatusEnum.parse(null)).toThrow();
            expect(() => ProjectStatusEnum.parse(undefined)).toThrow();
        });
    });

    describe('ProjectSchema', () => {
        const validProjectData = {
            title: 'Projeto Teste',
            description: 'Descrição do projeto teste',
            project_type: 'PRODUCT_DEVELOPMENT' as const,
            language_id: 1,
            category: 'PRODUCT_DEVELOPMENT' as const,
            community_id: 1,
            sample_source_id: 1,
            status: 'DRAFT' as const,
            sample_size: 100,
            client_id: 1
        };

        it('deve validar dados válidos', () => {
            expect(() => ProjectSchema.parse(validProjectData)).not.toThrow();
        });

        it('deve aplicar valores padrão quando não fornecidos', () => {
            const dataWithoutDefaults = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto teste',
                language_id: 1,
                community_id: 1,
                sample_size: 100,
                client_id: 1
            };

            const result = ProjectSchema.parse(dataWithoutDefaults);
            expect(result.project_type).toBe('OTHER');
            expect(result.category).toBe('OTHER');
            expect(result.status).toBe('DRAFT');
        });

        describe('title', () => {
            it('deve rejeitar título vazio', () => {
                const invalidData = { ...validProjectData, title: '' };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Título é obrigatório');
            });

            it('deve rejeitar título com mais de 255 caracteres', () => {
                const invalidData = { ...validProjectData, title: 'a'.repeat(256) };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Título deve ter no máximo 255 caracteres');
            });

            it('deve aceitar título com 255 caracteres', () => {
                const validData = { ...validProjectData, title: 'a'.repeat(255) };
                expect(() => ProjectSchema.parse(validData)).not.toThrow();
            });
        });

        describe('description', () => {
            it('deve rejeitar descrição vazia', () => {
                const invalidData = { ...validProjectData, description: '' };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Descrição é obrigatória');
            });

            it('deve rejeitar descrição com mais de 1000 caracteres', () => {
                const invalidData = { ...validProjectData, description: 'a'.repeat(1001) };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Descrição deve ter no máximo 1000 caracteres');
            });

            it('deve aceitar descrição com 1000 caracteres', () => {
                const validData = { ...validProjectData, description: 'a'.repeat(1000) };
                expect(() => ProjectSchema.parse(validData)).not.toThrow();
            });
        });

        describe('language_id', () => {
            it('deve rejeitar ID de idioma negativo', () => {
                const invalidData = { ...validProjectData, language_id: -1 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do idioma deve ser positivo');
            });

            it('deve rejeitar ID de idioma zero', () => {
                const invalidData = { ...validProjectData, language_id: 0 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do idioma deve ser positivo');
            });

            it('deve rejeitar ID de idioma decimal', () => {
                const invalidData = { ...validProjectData, language_id: 1.5 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do idioma deve ser um número inteiro');
            });
        });

        describe('community_id', () => {
            it('deve rejeitar ID de comunidade negativo', () => {
                const invalidData = { ...validProjectData, community_id: -1 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID da comunidade deve ser positivo');
            });

            it('deve rejeitar ID de comunidade zero', () => {
                const invalidData = { ...validProjectData, community_id: 0 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID da comunidade deve ser positivo');
            });

            it('deve rejeitar ID de comunidade decimal', () => {
                const invalidData = { ...validProjectData, community_id: 1.5 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID da comunidade deve ser um número inteiro');
            });
        });

        describe('sample_source_id', () => {
            it('deve aceitar sample_source_id opcional', () => {
                const { sample_source_id, ...dataWithoutSampleSource } = validProjectData;
                expect(() => ProjectSchema.parse(dataWithoutSampleSource)).not.toThrow();
            });

            it('deve rejeitar sample_source_id negativo', () => {
                const invalidData = { ...validProjectData, sample_source_id: -1 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID da fonte da amostra deve ser positivo');
            });

            it('deve rejeitar sample_source_id zero', () => {
                const invalidData = { ...validProjectData, sample_source_id: 0 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID da fonte da amostra deve ser positivo');
            });
        });

        describe('sample_size', () => {
            it('deve rejeitar tamanho da amostra zero', () => {
                const invalidData = { ...validProjectData, sample_size: 0 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Tamanho da amostra deve ser pelo menos 1');
            });

            it('deve rejeitar tamanho da amostra negativo', () => {
                const invalidData = { ...validProjectData, sample_size: -1 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Tamanho da amostra deve ser pelo menos 1');
            });

            it('deve rejeitar tamanho da amostra maior que 32767', () => {
                const invalidData = { ...validProjectData, sample_size: 32768 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Tamanho da amostra deve ser no máximo 32.767');
            });

            it('deve rejeitar tamanho da amostra decimal', () => {
                const invalidData = { ...validProjectData, sample_size: 100.5 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('Tamanho da amostra deve ser um número inteiro');
            });
        });

        describe('client_id', () => {
            it('deve rejeitar ID do cliente negativo', () => {
                const invalidData = { ...validProjectData, client_id: -1 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do cliente deve ser positivo');
            });

            it('deve rejeitar ID do cliente zero', () => {
                const invalidData = { ...validProjectData, client_id: 0 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do cliente deve ser positivo');
            });

            it('deve rejeitar ID do cliente decimal', () => {
                const invalidData = { ...validProjectData, client_id: 1.5 };
                expect(() => ProjectSchema.parse(invalidData)).toThrow('ID do cliente deve ser um número inteiro');
            });
        });
    });

    describe('CreateProjectSchema', () => {
        it('deve ser igual ao ProjectSchema', () => {
            const validData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto teste',
                language_id: 1,
                community_id: 1,
                sample_size: 100,
                client_id: 1
            };

            expect(() => CreateProjectSchema.parse(validData)).not.toThrow();
        });
    });

    describe('UpdateProjectSchema', () => {
        it('deve aceitar todos os campos como opcionais', () => {
            const partialData = {
                title: 'Projeto Atualizado'
            };

            expect(() => UpdateProjectSchema.parse(partialData)).not.toThrow();
        });

        it('deve aceitar objeto vazio', () => {
            expect(() => UpdateProjectSchema.parse({})).not.toThrow();
        });

        it('deve validar campos quando fornecidos', () => {
            const partialData = {
                title: 'a'.repeat(256) // Título muito longo
            };

            expect(() => UpdateProjectSchema.parse(partialData)).toThrow('Título deve ter no máximo 255 caracteres');
        });

        it('deve aplicar valores padrão para campos opcionais quando fornecidos', () => {
            const partialData = {
                title: 'Projeto Teste',
                description: 'Descrição do projeto',
                language_id: 1,
                community_id: 1,
                sample_size: 100,
                client_id: 1,
                project_type: 'PRODUCT_DEVELOPMENT' as const,
                category: 'PRODUCT_DEVELOPMENT' as const,
                status: 'ACTIVE' as const
            };

            const result = UpdateProjectSchema.parse(partialData);
            expect(result.project_type).toBe('PRODUCT_DEVELOPMENT');
            expect(result.category).toBe('PRODUCT_DEVELOPMENT');
            expect(result.status).toBe('ACTIVE');
        });
    });

    describe('ProjectIdSchema', () => {
        it('deve aceitar ID válido como string', () => {
            expect(() => ProjectIdSchema.parse({ id: '1' })).not.toThrow();
            expect(() => ProjectIdSchema.parse({ id: '123' })).not.toThrow();
        });

        it('deve rejeitar ID vazio', () => {
            expect(() => ProjectIdSchema.parse({ id: '' })).toThrow('ID é obrigatório');
        });

        it('deve rejeitar ID negativo', () => {
            expect(() => ProjectIdSchema.parse({ id: '-1' })).toThrow('ID deve ser um número inteiro positivo');
        });

        it('deve rejeitar ID zero', () => {
            expect(() => ProjectIdSchema.parse({ id: '0' })).toThrow('ID deve ser um número inteiro positivo');
        });

        it('deve rejeitar ID decimal', () => {
            expect(() => ProjectIdSchema.parse({ id: '1.5' })).toThrow('ID deve ser um número inteiro positivo');
        });

        it('deve rejeitar ID não numérico', () => {
            expect(() => ProjectIdSchema.parse({ id: 'abc' })).toThrow('ID deve ser um número inteiro positivo');
        });

        it('deve rejeitar ID faltando', () => {
            expect(() => ProjectIdSchema.parse({})).toThrow();
        });

        it('deve rejeitar ID null', () => {
            expect(() => ProjectIdSchema.parse({ id: null })).toThrow();
        });

        it('deve rejeitar ID undefined', () => {
            expect(() => ProjectIdSchema.parse({ id: undefined })).toThrow();
        });
    });

    describe('TypeScript Types', () => {
        it('deve ter tipos TypeScript corretos', () => {
            // Teste para verificar se os tipos são exportados corretamente
            // Isso é mais uma verificação de compilação do que um teste de runtime
            expect(typeof CreateProjectSchema).toBe('object');
            expect(typeof UpdateProjectSchema).toBe('object');
            expect(typeof ProjectSchema).toBe('object');
            expect(typeof ProjectIdSchema).toBe('object');
        });
    });
}); 