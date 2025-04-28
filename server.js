const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve arquivos estáticos como HTML e imagens

// Conexão com o banco
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados com sucesso!');
    }
});

// Rota para retornar os animais
app.get('/animals', (req, res) => {
    const query = 'SELECT * FROM animals';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar animais:', err);
            return res.status(500).send('Erro ao buscar animais');
        }
        res.json(results);
    });
});

// Rota para doações
app.post('/doacao', (req, res) => {
    const { valor } = req.body;
    const query = 'INSERT INTO doacoes (valor) VALUES (?)';
    db.query(query, [valor], (err) => {
        if (err) {
            console.error('Erro ao registrar doação:', err);
            return res.status(500).send('Erro ao registrar doação');
        }
        res.send('Doação registrada com sucesso!');
    });
});

// Rota para feedback
app.post('/feedback', (req, res) => {
    const { nome, comentario } = req.body;
    const query = 'INSERT INTO feedback (nome, comentario) VALUES (?, ?)';
    db.query(query, [nome, comentario], (err) => {
        if (err) {
            console.error('Erro ao salvar feedback:', err);
            return res.status(500).send('Erro ao salvar feedback');
        }
        res.send('Feedback enviado com sucesso!');
    });
});

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
