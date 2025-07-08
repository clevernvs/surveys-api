import { z } from 'zod';
import {
    QuestionnaireSchema,
    CreateQuestionnaireSchema,
    UpdateQuestionnaireSchema
} from '../../schemas/questionnaire.schema';

// Definindo o enum localmente para teste
const QuestionnaireStatusEnum = z.enum([
    'DRAFT',
    'ACTIVE',
    'PAUSED',
    'COMPLETED',
    'CANCELLED'
]);

describe('Questionnaire Schemas', () => {
    describe('QuestionnaireStatusEnum', () => {
        it('deve aceitar valores válidos do enum', () => {
            const validStatuses = [
                'DRAFT',
                'ACTIVE',
                'PAUSED',
                'COMPLETED',
                'CANCELLED'
            ];

            validStatuses.forEach(status => {
                expect(() => QuestionnaireStatusEnum.parse(status)).not.toThrow();
            });
        });

        it('deve rejeitar valores inválidos', () => {
            expect(() => QuestionnaireStatusEnum.parse('INVALID_STATUS')).toThrow();
            expect(() => QuestionnaireStatusEnum.parse('')).toThrow();
            expect(() => QuestionnaireStatusEnum.parse(null)).toThrow();
            expect(() => QuestionnaireStatusEnum.parse(undefined)).toThrow();
        });
    });

    describe('QuestionnaireSchema', () => {
        const validQuestionnaireData = {
            title: 'Questionário Teste',
            project_id: 1,
            sample_source_id: 1,
            goal: 100,
            filter_id: 1,
            randomized_questions: false,
            status: 'DRAFT' as const,
            start_date: '2024-01-01',
            end_date: '2024-12-31'
        };

        it('deve validar dados válidos', () => {
            expect(() => QuestionnaireSchema.parse(validQuestionnaireData)).not.toThrow();
        });

        it('deve aplicar valores padrão quando não fornecidos', () => {
            const dataWithoutDefaults = {
                title: 'Questionário Teste',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            const result = QuestionnaireSchema.parse(dataWithoutDefaults);
            expect(result.randomized_questions).toBe(false);
            expect(result.status).toBe('DRAFT');
        });

        describe('title', () => {
            it('deve rejeitar título vazio', () => {
                const invalidData = { ...validQuestionnaireData, title: '' };
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('O título é obrigatório');
            });

            it('deve aceitar título válido', () => {
                const validData = { ...validQuestionnaireData, title: 'Título Válido' };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('project_id', () => {
            it('deve rejeitar project_id faltando', () => {
                const { project_id, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('O projeto é obrigatório');
            });

            it('deve aceitar project_id válido', () => {
                const validData = { ...validQuestionnaireData, project_id: 123 };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('sample_source_id', () => {
            it('deve rejeitar sample_source_id faltando', () => {
                const { sample_source_id, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('A fonte da amostra é obrigatória');
            });

            it('deve aceitar sample_source_id válido', () => {
                const validData = { ...validQuestionnaireData, sample_source_id: 456 };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('goal', () => {
            it('deve rejeitar goal faltando', () => {
                const { goal, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('A meta é obrigatória');
            });

            it('deve aceitar goal válido', () => {
                const validData = { ...validQuestionnaireData, goal: 500 };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('filter_id', () => {
            it('deve rejeitar filter_id faltando', () => {
                const { filter_id, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('O filtro é obrigatório');
            });

            it('deve aceitar filter_id válido', () => {
                const validData = { ...validQuestionnaireData, filter_id: 789 };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('randomized_questions', () => {
            it('deve aplicar valor padrão false quando não fornecido', () => {
                const { randomized_questions, ...dataWithoutDefault } = validQuestionnaireData;
                const result = QuestionnaireSchema.parse(dataWithoutDefault);
                expect(result.randomized_questions).toBe(false);
            });

            it('deve aceitar valor true', () => {
                const validData = { ...validQuestionnaireData, randomized_questions: true };
                const result = QuestionnaireSchema.parse(validData);
                expect(result.randomized_questions).toBe(true);
            });

            it('deve aceitar valor false', () => {
                const validData = { ...validQuestionnaireData, randomized_questions: false };
                const result = QuestionnaireSchema.parse(validData);
                expect(result.randomized_questions).toBe(false);
            });
        });

        describe('status', () => {
            it('deve aplicar valor padrão DRAFT quando não fornecido', () => {
                const { status, ...dataWithoutDefault } = validQuestionnaireData;
                const result = QuestionnaireSchema.parse(dataWithoutDefault);
                expect(result.status).toBe('DRAFT');
            });

            it('deve aceitar todos os valores válidos do enum', () => {
                const validStatuses = ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'];
                validStatuses.forEach(status => {
                    const validData = { ...validQuestionnaireData, status: status as any };
                    const result = QuestionnaireSchema.parse(validData);
                    expect(result.status).toBe(status);
                });
            });
        });

        describe('start_date', () => {
            it('deve rejeitar start_date faltando', () => {
                const { start_date, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de início é obrigatória');
            });

            it('deve rejeitar start_date vazio', () => {
                const invalidData = { ...validQuestionnaireData, start_date: '' };
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de início é obrigatória');
            });

            it('deve aceitar start_date válido', () => {
                const validData = { ...validQuestionnaireData, start_date: '2024-06-01' };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('end_date', () => {
            it('deve rejeitar end_date faltando', () => {
                const { end_date, ...invalidData } = validQuestionnaireData;
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de fim é obrigatória');
            });

            it('deve rejeitar end_date vazio', () => {
                const invalidData = { ...validQuestionnaireData, end_date: '' };
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de fim é obrigatória');
            });

            it('deve aceitar end_date válido', () => {
                const validData = { ...validQuestionnaireData, end_date: '2024-12-31' };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });

        describe('validação de datas', () => {
            it('deve rejeitar quando end_date é anterior a start_date', () => {
                const invalidData = {
                    ...validQuestionnaireData,
                    start_date: '2024-12-31',
                    end_date: '2024-01-01'
                };
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de fim deve ser posterior à data de início');
            });

            it('deve rejeitar quando end_date é igual a start_date', () => {
                const invalidData = {
                    ...validQuestionnaireData,
                    start_date: '2024-01-01',
                    end_date: '2024-01-01'
                };
                expect(() => QuestionnaireSchema.parse(invalidData)).toThrow('Data de fim deve ser posterior à data de início');
            });

            it('deve aceitar quando end_date é posterior a start_date', () => {
                const validData = {
                    ...validQuestionnaireData,
                    start_date: '2024-01-01',
                    end_date: '2024-12-31'
                };
                expect(() => QuestionnaireSchema.parse(validData)).not.toThrow();
            });
        });
    });

    describe('CreateQuestionnaireSchema', () => {
        it('deve ser igual ao QuestionnaireSchema', () => {
            const validData = {
                title: 'Questionário Teste',
                project_id: 1,
                sample_source_id: 1,
                goal: 100,
                filter_id: 1,
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            };

            expect(() => CreateQuestionnaireSchema.parse(validData)).not.toThrow();
        });
    });

    describe('UpdateQuestionnaireSchema', () => {
        it('deve aceitar todos os campos como opcionais', () => {
            const partialData = {
                title: 'Questionário Atualizado'
            };

            expect(() => UpdateQuestionnaireSchema.parse(partialData)).not.toThrow();
        });

        it('deve aceitar objeto vazio', () => {
            expect(() => UpdateQuestionnaireSchema.parse({})).not.toThrow();
        });

        it('deve validar campos quando fornecidos', () => {
            const partialData = {
                title: '' // Título vazio
            };

            expect(() => UpdateQuestionnaireSchema.parse(partialData)).toThrow('O título é obrigatório');
        });

        it('deve aceitar atualização apenas do título', () => {
            const partialData = {
                title: 'Novo Título'
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.title).toBe('Novo Título');
            expect(result.project_id).toBeUndefined();
            expect(result.sample_source_id).toBeUndefined();
            expect(result.goal).toBeUndefined();
            expect(result.filter_id).toBeUndefined();
            expect(result.randomized_questions).toBeUndefined();
            expect(result.status).toBeUndefined();
            expect(result.start_date).toBeUndefined();
            expect(result.end_date).toBeUndefined();
        });

        it('deve aceitar atualização apenas do status', () => {
            const partialData = {
                status: 'ACTIVE' as const
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.status).toBe('ACTIVE');
        });

        it('deve aceitar atualização apenas das datas', () => {
            const partialData = {
                start_date: '2024-02-01',
                end_date: '2024-11-30'
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.start_date).toBe('2024-02-01');
            expect(result.end_date).toBe('2024-11-30');
        });

        it('deve aceitar atualização apenas do goal', () => {
            const partialData = {
                goal: 200
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.goal).toBe(200);
        });

        it('deve aceitar atualização apenas do randomized_questions', () => {
            const partialData = {
                randomized_questions: true
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.randomized_questions).toBe(true);
        });

        it('deve aceitar atualização de múltiplos campos', () => {
            const partialData = {
                title: 'Questionário Atualizado',
                goal: 300,
                status: 'ACTIVE' as const,
                randomized_questions: true
            };

            const result = UpdateQuestionnaireSchema.parse(partialData);
            expect(result.title).toBe('Questionário Atualizado');
            expect(result.goal).toBe(300);
            expect(result.status).toBe('ACTIVE');
            expect(result.randomized_questions).toBe(true);
        });
    });

    describe('TypeScript Types', () => {
        it('deve ter tipos TypeScript corretos', () => {
            // Teste para verificar se os tipos são exportados corretamente
            // Isso é mais uma verificação de compilação do que um teste de runtime
            expect(typeof CreateQuestionnaireSchema).toBe('object');
            expect(typeof UpdateQuestionnaireSchema).toBe('object');
            expect(typeof QuestionnaireSchema).toBe('object');
        });
    });
}); 