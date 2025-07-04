import {
    CompanySchema,
    CreateCompanySchema,
    UpdateCompanySchema,
    CompanyIdSchema,
} from '../../schemas/company.schema';

describe('Company Schemas', () => {
    describe('CompanySchema', () => {
        it('deve validar dados válidos', () => {
            const validData = { name: 'Empresa Teste' };
            const result = CompanySchema.safeParse(validData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it('deve rejeitar nome vazio', () => {
            const invalidData = { name: '' };
            const result = CompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });

        it('deve rejeitar nome com apenas espaços', () => {
            const invalidData = { name: '   ' };
            const result = CompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });

        it('deve rejeitar nome muito longo', () => {
            const invalidData = { name: 'a'.repeat(256) };
            const result = CompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome deve ter no máximo 255 caracteres');
            }
        });

        it('deve remover espaços em branco do nome', () => {
            const dataWithSpaces = { name: '  Empresa Teste  ' };
            const result = CompanySchema.safeParse(dataWithSpaces);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.name).toBe('Empresa Teste');
            }
        });

        it('deve rejeitar quando name não é fornecido', () => {
            const invalidData = {};
            const result = CompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Required');
            }
        });
    });

    describe('CreateCompanySchema', () => {
        it('deve validar dados válidos para criação', () => {
            const validData = { name: 'Nova Empresa' };
            const result = CreateCompanySchema.safeParse(validData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it('deve rejeitar dados inválidos para criação', () => {
            const invalidData = { name: '' };
            const result = CreateCompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
        });
    });

    describe('UpdateCompanySchema', () => {
        it('deve validar dados válidos para atualização', () => {
            const validData = { name: 'Empresa Atualizada' };
            const result = UpdateCompanySchema.safeParse(validData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validData);
            }
        });

        it('deve permitir atualização parcial (nome opcional)', () => {
            const partialData = {};
            const result = UpdateCompanySchema.safeParse(partialData);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(partialData);
            }
        });

        it('deve rejeitar nome inválido na atualização', () => {
            const invalidData = { name: '' };
            const result = UpdateCompanySchema.safeParse(invalidData);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Nome é obrigatório');
            }
        });
    });

    describe('CompanyIdSchema', () => {
        it('deve validar ID válido', () => {
            const validId = { id: '1' };
            const result = CompanyIdSchema.safeParse(validId);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validId);
            }
        });

        it('deve validar ID numérico grande', () => {
            const validId = { id: '999999' };
            const result = CompanyIdSchema.safeParse(validId);

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).toEqual(validId);
            }
        });

        it('deve rejeitar ID vazio', () => {
            const invalidId = { id: '' };
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID é obrigatório');
            }
        });

        it('deve rejeitar ID zero', () => {
            const invalidId = { id: '0' };
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID negativo', () => {
            const invalidId = { id: '-1' };
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID decimal', () => {
            const invalidId = { id: '1.5' };
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar ID não numérico', () => {
            const invalidId = { id: 'abc' };
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('ID deve ser um número inteiro positivo');
            }
        });

        it('deve rejeitar quando id não é fornecido', () => {
            const invalidId = {};
            const result = CompanyIdSchema.safeParse(invalidId);

            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Required');
            }
        });
    });
}); 