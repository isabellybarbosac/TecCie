const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/middleware');  // Importa o middleware

// Rota para exibir o formulário de gerenciamento de cards (somente admin)
router.get('/', isAdmin, (req, res) => {
        res.render('admin_form'); // Renderiza a view admin_form.ejs
});

module.exports = router;
