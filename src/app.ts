import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import companyRoutes from './routes/company.routes';

const env = dotenv.config();
dotenvExpand.expand(env);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running!!! 🚀');
});

app.get('/test', (req, res) => { res.send('ok') });

app.use('/api', companyRoutes);

export default app;
