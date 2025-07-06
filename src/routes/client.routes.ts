import { Router } from 'express';
import {
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
} from '../controllers/client.controller';
import { validateZod, validateParams } from '../middleware/zod-validation.middleware';
import { CreateClientSchema, UpdateClientSchema, ClientIdSchema } from '../schemas/client.schema';

const router = Router();

// Rotas para clientes
router.get('/clients', getAllClients);
router.get('/clients/:id', validateParams(ClientIdSchema), getClientById);
router.post('/clients', validateZod(CreateClientSchema), createClient);
router.put('/clients/:id', validateParams(ClientIdSchema), validateZod(UpdateClientSchema), updateClient);
router.delete('/clients/:id', validateParams(ClientIdSchema), deleteClient);

export default router; 