require('dotenv').config();
const express = require('express');
const cors = require('cors');


const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

const env = dotenv.config();
dotenvExpand.expand(env);


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Survey API running 🚀');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
