const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Rota para exibir as mulheres na ciência
router.get('/', async (req, res) => {
  try {
    const collection = req.dbClient.collection('women_in_science');
    const women = await collection.find().toArray();
    res.render('index', { women });
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro ao buscar dados');
  }
});

// Rota para curtir
router.post('/like/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const collection = req.dbClient.collection('women_in_science');

    // Incrementa as curtidas e retorna o documento atualizado
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } }
    );

    res.redirect('/'); // Redireciona de volta para a página principal
  } catch (error) {
    console.error('Erro ao atualizar curtidas:', error);
    res.status(500).send('Erro ao atualizar curtidas');
  }
});

module.exports = router;
