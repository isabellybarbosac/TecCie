const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { isAdmin } = require('../middleware/middleware');
const { isAuthenticated } = require('../middleware/middleware'); // Importa o middleware




// Rota para exibir as mulheres na ciência
router.get('/', async (req, res) => {
  try {
    const collection = req.dbClient.collection('women_in_science');
    const womeen = await collection.find().toArray();
    console.log('Women fetched:', womeen); // Adicione este log
    res.render('biografias', { womeen, user: req.session.user });
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

  } catch (error) {
    console.error('Erro ao atualizar curtidas:', error);
    res.status(500).send('Erro ao atualizar curtidas');
  }
});

// Rota para adicionar uma nova mulher (somente admin)
router.post('/add', isAdmin, async (req, res) => {
  const { name, description, image } = req.body;

  try {
    const collection = req.dbClient.collection('women_in_science');
    await collection.insertOne({ name, description, image, likes: 0 });
    res.redirect('/biografias');
  } catch (error) {
    console.error('Erro ao adicionar mulher:', error);
    res.status(500).send('Erro ao adicionar mulher');
  }
});

router.post('/edit', isAdmin, async (req, res) => {
  const { name, description, image } = req.body;

  try {
    const collection = req.dbClient.collection('women_in_science');
    const result = await collection.updateOne(
      { name: name }, // Filtra pela mulher a ser editada
      { $set: { description: description, image: image } } // Atualiza os campos
    );

    if (result.matchedCount === 0) {
      return res.status(404).send(`Mulher ${name} não encontrada!`);
    }

    res.send(`Mulher ${name} editada com sucesso!`);
  } catch (error) {
    console.error('Erro ao editar mulher:', error);
    res.status(500).send('Erro ao editar mulher');
  }
});
// Rota para deletar uma mulher pelo nome (somente admin)
router.post('/delete', isAdmin, async (req, res) => {
  const name = req.body.name; // Obtenha o nome do corpo da requisição

  try {
    const collection = req.dbClient.collection('women_in_science');
    const result = await collection.deleteOne({ name: name });

    if (result.deletedCount === 0) {
      return res.status(404).send(`Mulher ${name} não encontrada!`);
    }

    res.send(`Mulher ${name} deletada com sucesso!`);
  } catch (error) {
    console.error('Erro ao deletar mulher:', error);
    res.status(500).send('Erro ao deletar mulher');
  }
});
// Rota para exibir o formulário de gerenciamento de cards (somente admin)
router.get('/admin', isAdmin, (req, res) => {
  res.render('admin_form'); // Crie uma nova view chamada admin_form.ejs
});



module.exports = router;
