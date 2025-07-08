import { CreateAnswerSchema, UpdateAnswerSchema } from '../../schemas/answer.schema';

describe('Answer Schemas', () => {
    const validData = {
        question_id: 1,
        answer_type: 'TEXT',
        value: 'Resposta teste',
        fixed: false,
        order_index: 1,
        skip_to_question_id: null
    };

    it('deve validar dados válidos', () => {
        expect(() => CreateAnswerSchema.parse(validData)).not.toThrow();
    });

    it('deve aplicar valores padrão', () => {
        const { answer_type, fixed, ...data } = validData;
        const result = CreateAnswerSchema.parse(data);
        expect(result.answer_type).toBe('TEXT');
        expect(result.fixed).toBe(false);
    });

    it('deve rejeitar question_id ausente', () => {
        const { question_id, ...data } = validData;
        expect(() => CreateAnswerSchema.parse(data)).toThrow('O ID da pergunta é obrigatório');
    });

    it('deve rejeitar value vazio', () => {
        const data = { ...validData, value: '' };
        expect(() => CreateAnswerSchema.parse(data)).toThrow('O valor é obrigatório');
    });

    it('deve rejeitar order_index ausente', () => {
        const { order_index, ...data } = validData;
        expect(() => CreateAnswerSchema.parse(data)).toThrow('A ordem é obrigatória');
    });

    it('deve aceitar todos os answer_type válidos', () => {
        const types = ['TEXT', 'NUMBER', 'DATE', 'BOOLEAN', 'MULTIPLE_CHOICE', 'SINGLE_CHOICE', 'RATING', 'GRID_COLUMN', 'GRID_ROW'];
        types.forEach(type => {
            const data = { ...validData, answer_type: type };
            expect(() => CreateAnswerSchema.parse(data)).not.toThrow();
        });
    });

    it('deve rejeitar answer_type inválido', () => {
        const data = { ...validData, answer_type: 'INVALID' };
        expect(() => CreateAnswerSchema.parse(data)).toThrow();
    });

    it('deve aceitar skip_to_question_id como null', () => {
        const data = { ...validData, skip_to_question_id: null };
        expect(() => CreateAnswerSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar skip_to_question_id como número', () => {
        const data = { ...validData, skip_to_question_id: 5 };
        expect(() => CreateAnswerSchema.parse(data)).not.toThrow();
    });

    it('deve aceitar skip_to_question_id ausente', () => {
        const { skip_to_question_id, ...data } = validData;
        expect(() => CreateAnswerSchema.parse(data)).not.toThrow();
    });

    describe('UpdateAnswerSchema', () => {
        it('deve aceitar objeto vazio', () => {
            expect(() => UpdateAnswerSchema.parse({})).not.toThrow();
        });
        it('deve aceitar atualização parcial', () => {
            expect(() => UpdateAnswerSchema.parse({ value: 'Nova' })).not.toThrow();
        });
        it('deve validar campos quando fornecidos', () => {
            expect(() => UpdateAnswerSchema.parse({ value: '' })).toThrow('O valor é obrigatório');
        });
    });
}); 