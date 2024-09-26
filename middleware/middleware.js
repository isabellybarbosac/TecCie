// middleware.js

// Middleware para verificar se o usuário é admin
function isAdmin(req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
                next(); // Usuário é admin, prossegue para a rota
        } else {
                res.status(403).send('Acesso negado.'); // Usuário não é admin
        }
}

// Middleware para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
        if (req.session.user) {
                return next(); // Usuário está logado, prossegue
        }
        req.session.redirectTo = req.originalUrl; // Salva a URL original antes do login
        res.redirect('/auth/login'); // Usuário não está logado, redireciona para login
}

module.exports = {
        isAdmin,
        isAuthenticated,
};
