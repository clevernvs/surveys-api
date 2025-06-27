// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import dotenvExpand from 'dotenv-expand';

// const env = dotenv.config();
// dotenvExpand.expand(env);

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Rotas base
// app.get('/', (_req, res) => {
//     res.send('Survey API running 🚀');
// });

// export default app;
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

const env = dotenv.config();
dotenvExpand.expand(env);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Survey API running 🚀');
});

export default app;
