import { CreateQuestionSchema, UpdateQuestionSchema } from '../../schemas/question.schema';

describe('Question Schemas', () => {
    const validData = {
        questionnaire_id: 1,
        question_type: 'TEXT',
        title: 'Pergunta teste',
        required: false,
        randomize_answers: false,
        order_index: 1,
        kpi: 'KPI',
        attributes: 'attr',
        brand: 'Marca',
        product_brand: 'Produto'
    };

    it('deve validar dados válidos', () => {
        expect(() => CreateQuestionSchema.parse(validData)).not.toThrow();
    });

    it('deve aplicar valores padrão', () => {
        const { required, randomize_answers, question_type, ...data } = validData;
        const result = CreateQuestionSchema.parse(data);
        expect(result.required).toBe(false);
        expect(result.randomize_answers).toBe(false);
        expect(result.question_type).toBe('TEXT');
    });

    it('deve rejeitar questionnaire_id ausente', () => {
        const { questionnaire_id, ...data } = validData;
        expect(() => CreateQuestionSchema.parse(data)).toThrow('O ID do questionário é obrigatório');
    });

    it('deve rejeitar title vazio', () => {
        const data = { ...validData, title: '' };
        expect(() => CreateQuestionSchema.parse(data)).toThrow('O título é obrigatório');
    });

    it('deve rejeitar order_index ausente', () => {
        const { order_index, ...data } = validData;
        expect(() => CreateQuestionSchema.parse(data)).toThrow('A ordem é obrigatória');
    });

    it('deve aceitar todos os question_type válidos', () => {
        const types = ['TEXT', 'OPEN_ANSWER', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'GRID', 'RANKING', 'NPS', 'SYMBOL'];
        types.forEach(type => {
            const data = { ...validData, question_type: type };
            expect(() => CreateQuestionSchema.parse(data)).not.toThrow();
        });
    });

    it('deve rejeitar question_type inválido', () => {
        const data = { ...validData, question_type: 'INVALID' };
        expect(() => CreateQuestionSchema.parse(data)).toThrow();
    });

    it('deve aceitar campos opcionais ausentes', () => {
        const { kpi, attributes, brand, product_brand, ...data } = validData;
        expect(() => CreateQuestionSchema.parse(data)).not.toThrow();
    });

    describe('UpdateQuestionSchema', () => {
        it('deve aceitar objeto vazio', () => {
            expect(() => UpdateQuestionSchema.parse({})).not.toThrow();
        });
        it('deve aceitar atualização parcial', () => {
            expect(() => UpdateQuestionSchema.parse({ title: 'Nova' })).not.toThrow();
        });
        it('deve validar campos quando fornecidos', () => {
            expect(() => UpdateQuestionSchema.parse({ title: '' })).toThrow('O título é obrigatório');
        });
    });
}); 