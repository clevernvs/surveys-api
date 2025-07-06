import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';
import { CreateClientInput, UpdateClientInput } from '../schemas/client.schema';

const clientService = new ClientService();

export const getAllClients = async (_req: Request, res: Response) => {
    try {
        const clients = await clientService.findAll();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar clientes' });
    }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const client = await clientService.findById(Number(id));

        if (!client) {
            res.status(404).json({ error: 'Cliente não encontrado' });
            return;
        }

        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cliente' });
    }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
    const clientData: CreateClientInput = req.body;

    try {
        const client = await clientService.create(clientData);
        res.status(201).json(client);
    } catch (error: any) {
        if (error.message.includes('obrigatório') || error.message.includes('válido')) {
            res.status(400).json({ error: error.message });
        } else if (error.message.includes('já existe')) {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro ao criar cliente' });
        }
    }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const clientData: UpdateClientInput = req.body;

    try {
        const client = await clientService.update(Number(id), clientData);
        res.json(client);
    } catch (error: any) {
        if (error.message.includes('não encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('obrigatório') || error.message.includes('válido')) {
            res.status(400).json({ error: error.message });
        } else if (error.message.includes('já existe')) {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro ao atualizar cliente' });
        }
    }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await clientService.delete(Number(id));
        res.json(result);
    } catch (error: any) {
        if (error.message.includes('não encontrado')) {
            res.status(404).json({ error: error.message });
        } else if (error.message.includes('projetos relacionados')) {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Erro ao deletar cliente' });
        }
    }
}; 