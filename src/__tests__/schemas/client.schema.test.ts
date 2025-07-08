import { CreateClientSchema, UpdateClientSchema, ClientIdSchema } from '../../schemas/client.schema';

describe('Client Schema', () => {
    describe('CreateClientSchema', () => {
        it('deve validar dados válidos', () => {
            const validData = {
                name: 'Cliente Teste',
                email: 'cliente@test.com'
            };

            const result = CreateClientSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar nome vazio', () => {
            const invalidData = {
                name: '',
                email: 'cliente@test.com'
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });

        it('deve rejeitar nome com apenas espaços', () => {
            const invalidData = {
                name: '   ',
                email: 'cliente@test.com'
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });

        it('deve rejeitar nome muito longo', () => {
            const invalidData = {
                name: 'a'.repeat(256),
                email: 'cliente@test.com'
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome deve ter no máximo 255 caracteres');
            }
        });

        it('deve rejeitar email inválido', () => {
            const invalidData = {
                name: 'Cliente Teste',
                email: 'email-invalido'
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email deve ser válido');
            }
        });

        it('deve rejeitar email vazio', () => {
            const invalidData = {
                name: 'Cliente Teste',
                email: ''
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email deve ser válido');
            }
        });

        it('deve rejeitar email muito longo', () => {
            const invalidData = {
                name: 'Cliente Teste',
                email: 'a'.repeat(250) + '@test.com'
            };

            const result = CreateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email deve ter no máximo 255 caracteres');
            }
        });
    });

    describe('UpdateClientSchema', () => {
        it('deve permitir atualização parcial', () => {
            const partialData = {
                name: 'Novo Nome'
            };

            const result = UpdateClientSchema.safeParse(partialData);
            expect(result.success).toBe(true);
        });

        it('deve permitir atualização apenas do email', () => {
            const partialData = {
                email: 'novo@test.com'
            };

            const result = UpdateClientSchema.safeParse(partialData);
            expect(result.success).toBe(true);
        });

        it('deve permitir objeto vazio', () => {
            const emptyData = {};

            const result = UpdateClientSchema.safeParse(emptyData);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar nome vazio quando fornecido', () => {
            const invalidData = {
                name: ''
            };

            const result = UpdateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });

        it('deve rejeitar email inválido quando fornecido', () => {
            const invalidData = {
                email: 'email-invalido'
            };

            const result = UpdateClientSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email deve ser válido');
            }
        });
    });

    describe('ClientIdSchema', () => {
        it('deve validar ID válido', () => {
            const validId = { id: '1' };

            const result = ClientIdSchema.safeParse(validId);
            expect(result.success).toBe(true);
        });

        it('deve rejeitar ID vazio', () => {
            const invalidId = { id: '' };

            const result = ClientIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID é obrigatório');
            }
        });

        it('deve rejeitar ID zero', () => {
            const invalidId = { id: '0' };

            const result = ClientIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID negativo', () => {
            const invalidId = { id: '-1' };

            const result = ClientIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID decimal', () => {
            const invalidId = { id: '1.5' };

            const result = ClientIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID não numérico', () => {
            const invalidId = { id: 'abc' };

            const result = ClientIdSchema.safeParse(invalidId);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });
    });
}); 