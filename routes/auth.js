const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');  // para criptografar a senha

// Rota para cadastro de usuário
router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const db = req.dbClient;  // Obtém a referência ao banco de dados

        // Verifica se o usuário já existe
        const user = await db.collection('users').findOne({ username: username });
        if (user) {
                return res.status(400).send('Usuário já existe');
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insere o novo usuário no banco de dados
        await db.collection('users').insertOne({ username, password: hashedPassword });

        res.redirect('/login');  // Redireciona para a página de login após cadastro
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const db = req.dbClient;

        // Procura o usuário no banco de dados
        const user = await db.collection('users').findOne({ username: username });
        if (!user) {
                return res.status(400).send('Usuário não encontrado');
        }

        // Compara a senha fornecida com a senha armazenada
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
                return res.status(400).send('Senha incorreta');
        }

        // Armazena o usuário na sessão após o login
        req.session.user = user;

        res.redirect('/biografias');  // Redireciona para a página de biografias após login
});


module.exports = router;
