const express = require('express');
const { createUser, listUsers, deleteUser, authenticateUser } = require('../services/user.service');

const identityRoute = express.Router();

identityRoute.post('/create-user', async (req, res) => {
  try {
    const result = createUser(req.body)
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
});

identityRoute.get('/list-user', async (req, res) => {
  try {
    const result = listUsers();
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
});

identityRoute.delete('/delete-user/:id', async (req, res) => {
  try {
    const result = deleteUser(req)

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado' });
    }

    res.status(200).send({ message: 'Usuário deletado com sucesso' })
  } catch (error) {
    res.status(400).send(error)
  }
});

identityRoute.post('/sigin', authenticateUser);

module.exports = identityRoute;