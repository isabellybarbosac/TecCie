// middleware.js

function isAdmin(req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
                next();
        } else {
                res.status(403).send('Acesso negado.');
        }
}


function isAuthenticated(req, res, next) {
        if (req.session.user) {
                return next();
        }
        req.session.redirectTo = req.originalUrl;
        res.redirect('/auth/login');
}

module.exports = {
        isAdmin,
        isAuthenticated,
};
