import { Request, Response } from 'express';
import { FilterService } from '../services/filter.service';

const filterService = new FilterService();

export const getAllFilters = async (_req: Request, res: Response) => {
    try {
        const filters = await filterService.findAll();
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao buscar filtros',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFilterById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
            return;
        }

        const filter = await filterService.findById(id);
        res.json({
            success: true,
            data: filter,
            message: 'Filtro encontrado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Filtro não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Filtro não encontrado',
                message: 'O filtro especificado não existe'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao buscar filtro',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const createFilter = async (req: Request, res: Response): Promise<void> => {
    try {
        const filter = await filterService.create(req.body);
        res.status(201).json({
            success: true,
            data: filter,
            message: 'Filtro criado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Questionário não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Questionário não encontrado',
                message: 'O questionário especificado não existe'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao criar filtro',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const updateFilter = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
            return;
        }

        const filter = await filterService.update(id, req.body);
        res.json({
            success: true,
            data: filter,
            message: 'Filtro atualizado com sucesso'
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Filtro não encontrado') {
                res.status(404).json({
                    success: false,
                    error: 'Filtro não encontrado',
                    message: 'O filtro especificado não existe'
                });
                return;
            }
            if (error.message === 'Questionário não encontrado') {
                res.status(404).json({
                    success: false,
                    error: 'Questionário não encontrado',
                    message: 'O questionário especificado não existe'
                });
                return;
            }
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao atualizar filtro',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const deleteFilter = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                success: false,
                error: 'ID inválido',
                message: 'O ID deve ser um número válido'
            });
            return;
        }

        const result = await filterService.delete(id);
        res.json({
            success: true,
            message: result.message
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'Filtro não encontrado') {
            res.status(404).json({
                success: false,
                error: 'Filtro não encontrado',
                message: 'O filtro especificado não existe'
            });
            return;
        }
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor ao deletar filtro',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFiltersByQuestionnaire = async (req: Request, res: Response): Promise<void> => {
    try {
        const questionnaireId = parseInt(req.params.questionnaireId);
        if (isNaN(questionnaireId)) {
            res.status(400).json({
                success: false,
                error: 'ID do questionário inválido',
                message: 'O ID do questionário deve ser um número válido'
            });
        }
        const filters = await filterService.findByQuestionnaireId(questionnaireId);
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar filtros por questionário',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFiltersByGender = async (req: Request, res: Response): Promise<void> => {
    try {
        const genderId = parseInt(req.params.genderId);
        if (isNaN(genderId)) {
            res.status(400).json({
                success: false,
                error: 'ID do gênero inválido',
                message: 'O ID do gênero deve ser um número válido'
            });
        }
        const filters = await filterService.findByGender(genderId);
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar filtros por gênero',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFiltersByAgeRange = async (req: Request, res: Response): Promise<void> => {
    try {
        const ageRangeId = parseInt(req.params.ageRangeId);
        if (isNaN(ageRangeId)) {
            res.status(400).json({
                success: false,
                error: 'ID da faixa etária inválido',
                message: 'O ID da faixa etária deve ser um número válido'
            });
        }
        const filters = await filterService.findByAgeRange(ageRangeId);
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar filtros por faixa etária',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFiltersBySocialClass = async (req: Request, res: Response): Promise<void> => {
    try {
        const socialClassId = parseInt(req.params.socialClassId);
        if (isNaN(socialClassId)) {
            res.status(400).json({
                success: false,
                error: 'ID da classe social inválido',
                message: 'O ID da classe social deve ser um número válido'
            });
        }
        const filters = await filterService.findBySocialClass(socialClassId);
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar filtros por classe social',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};

export const getFiltersByLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const countryId = parseInt(req.query.countryId as string);
        const stateId = req.query.stateId ? parseInt(req.query.stateId as string) : undefined;
        const cityId = req.query.cityId ? parseInt(req.query.cityId as string) : undefined;

        if (isNaN(countryId)) {
            res.status(400).json({
                success: false,
                error: 'ID do país inválido',
                message: 'O ID do país deve ser um número válido'
            });
        }

        const filters = await filterService.findByLocation(countryId, stateId, cityId);
        res.json({
            success: true,
            data: filters,
            message: 'Filtros encontrados com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Erro ao buscar filtros por localização',
            message: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
}; 