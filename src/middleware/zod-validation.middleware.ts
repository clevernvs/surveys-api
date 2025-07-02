import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

/**
 * Middleware para validar dados de entrada usando Zod
 */
export const validateZod = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validar o body da requisição
            const validatedData = schema.parse(req.body);

            // Substituir o body com os dados validados
            req.body = validatedData;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formatar erros do Zod
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    error: 'Dados inválidos',
                    details: errors
                });
            } else {
                console.error('Erro na validação Zod:', error);
                res.status(500).json({
                    error: 'Erro interno na validação',
                    details: 'Erro inesperado durante a validação'
                });
            }
        }
    };
};

/**
 * Middleware para validar parâmetros de rota usando Zod
 */
export const validateParams = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validar os parâmetros da rota
            const validatedParams = schema.parse(req.params);

            // Substituir os parâmetros com os dados validados
            req.params = validatedParams;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formatar erros do Zod
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    error: 'Parâmetros inválidos',
                    details: errors
                });
            } else {
                console.error('Erro na validação de parâmetros:', error);
                res.status(500).json({
                    error: 'Erro interno na validação',
                    details: 'Erro inesperado durante a validação'
                });
            }
        }
    };
};

/**
 * Middleware para validar query parameters usando Zod
 */
export const validateQuery = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validar os query parameters
            const validatedQuery = schema.parse(req.query);

            // Substituir os query parameters com os dados validados
            req.query = validatedQuery;

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formatar erros do Zod
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    error: 'Query parameters inválidos',
                    details: errors
                });
            } else {
                console.error('Erro na validação de query:', error);
                res.status(500).json({
                    error: 'Erro interno na validação',
                    details: 'Erro inesperado durante a validação'
                });
            }
        }
    };
};

/**
 * Middleware para validar múltiplos aspectos da requisição
 */
export const validateRequest = (options: {
    body?: ZodSchema;
    params?: ZodSchema;
    query?: ZodSchema;
}) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            // Validar body se fornecido
            if (options.body) {
                const validatedBody = options.body.parse(req.body);
                req.body = validatedBody;
            }

            // Validar params se fornecido
            if (options.params) {
                const validatedParams = options.params.parse(req.params);
                req.params = validatedParams;
            }

            // Validar query se fornecido
            if (options.query) {
                const validatedQuery = options.query.parse(req.query);
                req.query = validatedQuery;
            }

            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Formatar erros do Zod
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                res.status(400).json({
                    error: 'Dados inválidos',
                    details: errors
                });
            } else {
                console.error('Erro na validação:', error);
                res.status(500).json({
                    error: 'Erro interno na validação',
                    details: 'Erro inesperado durante a validação'
                });
            }
        }
    };
}; 