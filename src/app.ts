import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import companyRoutes from './routes/company.routes';
import projectRoutes from './routes/project.routes';
import questionnaireRoutes from './routes/questionnaire.routes';
import questionRoutes from './routes/question.routes';
import answerRoutes from './routes/answer.routes';

const env = dotenv.config();
dotenvExpand.expand(env);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running!!! 🚀');
});

app.get('/test', (req, res) => { res.send('ok') });

app.use('/api/v2', companyRoutes);
app.use('/api/v2', projectRoutes);
app.use('/api/v2', questionnaireRoutes);
app.use('/api/v2', questionRoutes);
app.use('/api/v2', answerRoutes);

export default app;
