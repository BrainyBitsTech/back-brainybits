const express = require('express');
const { createUser, listUsers, deleteUser, authenticateUser } = require('../services/user.service.js');

const identityRoute = express.Router();
identityRoute.post('/create-user', createUser);
identityRoute.get('/list-user', listUsers);
identityRoute.delete('/delete-user/:id', deleteUser);
identityRoute.post('/sigin', authenticateUser);

module.exports = identityRoute;