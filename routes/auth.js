const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // para criptografar a senha
const { isAdmin } = require('../middleware/middleware');  // Importa o middleware


// Rota para cadastro de usuário
router.post('/register', async (req, res) => {
        const { username, password } = req.body;
        const db = req.dbClient;

        // Validações simples
        if (username.length < 3) {
                return res.status(400).send('Nome de usuário deve ter pelo menos 3 caracteres');
        }
        if (password.length < 6) {
                return res.status(400).send('A senha deve ter pelo menos 6 caracteres');
        }

        try {
                // Verifica se o usuário já existe
                const user = await db.collection('users').findOne({ username });
                if (user) {
                        return res.status(400).send('Usuário ou senha inválidos');
                }

                // Criptografa a senha antes de salvar
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insere o novo usuário no banco de dados
                await db.collection('users').insertOne({ username, password: hashedPassword, isAdmin: false });

                res.redirect('/auth/login'); // Redireciona para a página de login após cadastro
        } catch (error) {
                console.error('Erro ao registrar usuário:', error);
                res.status(500).send('Erro ao registrar usuário');
        }
});

// Rota para login de usuário
router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        const db = req.dbClient;

        try {
                // Procura o usuário no banco de dados
                const user = await db.collection('users').findOne({ username });
                if (!user) {
                        return res.status(400).send('Usuário ou senha inválidos');
                }

                // Compara a senha fornecida com a senha armazenada
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                        return res.status(400).send('Usuário ou senha inválidos');
                }

                // Armazena o usuário na sessão após o login
                req.session.user = user;

                // Após autenticação bem-sucedida
                if (user.isAdmin) {
                        res.redirect('/biografias/admin');
                } else {
                        res.redirect('/');
                }
        } catch (error) {
                console.error('Erro ao fazer login:', error);
                res.status(500).send('Erro ao fazer login');
        }
});

// Rota para logout
router.get('/logout', (req, res) => {
        req.session.destroy(err => {
                if (err) {
                        return res.status(500).send('Erro ao fazer logout');
                }
                res.redirect('/auth/login');
        });
});

// Exibe o formulário de cadastro
router.get('/register', (req, res) => {
        res.render('register');
});

// Exibe o formulário de login
router.get('/login', (req, res) => {
        res.render('login');
});

// Rota protegida para a página de administração
router.get('/', isAdmin, (req, res) => {
        // Renderiza a página de administração apenas se for administrador
        res.render('admin');
});

module.exports = router;
