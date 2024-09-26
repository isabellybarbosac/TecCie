var express = require('express');
var router = express.Router();

router.get('/', async function (req, res, next) {
        const collection = req.dbClient.collection('SugestoesTecCie');

        try {
                const suges = await collection.find({}).toArray();
                res.render('sugestoes', { suges });
        } catch (err) {
                next(err);
        }
});

router.post('/', async function (req, res, next) {
        const { suges } = req.body;

        try {
                const collection = req.dbClient.collection('SugestoesTecCie');
                await collection.insertOne({ sugestao: suges }); // Correção aqui
                res.redirect('/sugestoes');
        } catch (err) {
                next(err);
        }
});

module.exports = router;
