require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',  require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/plans', require('./routes/plans'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor Conecta.Net rodando na porta ${PORT}`));
