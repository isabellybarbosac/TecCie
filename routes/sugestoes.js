var express = require('express');
var router = express.Router();

// Middleware de autenticação
function isAuthenticated(req, res, next) {
        if (req.session.user) {
                return next(); // Se o usuário estiver autenticado, prossiga
        } else {
                req.session.redirectTo = req.originalUrl;
                res.redirect('/auth/login'); // Redireciona para a página de login se não estiver autenticado
        }
}

// Rota para visualizar as sugestões, protegida pelo middleware
router.get('/', isAuthenticated, async function (req, res, next) {
        const collection = req.dbClient.collection('SugestoesTecCie');
        try {
                const suges = await collection.find({}).toArray();
                res.render('sugestoes', { suges }
                );
        } catch (err) {
                next(err);
        }
});

// Rota para enviar uma sugestão, protegida pelo middleware
router.post('/', isAuthenticated, async function (req, res, next) {
        const { suges } = req.body;

        try {
                const collection = req.dbClient.collection('SugestoesTecCie');
                await collection.insertOne({ sugestao: suges, usuario: req.session.user.username }); // Adiciona o usuário à sugestão
                res.redirect('/sugestoes');
        } catch (err) {
                next(err);
        }
});

module.exports = router;
