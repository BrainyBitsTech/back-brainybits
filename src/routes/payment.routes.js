const express = require('express');
const { payment } = require('../services/payment.service');

const payment = express.Router();

identityRoute.post('/checkout', async (req, res) => {
  try {
    const result = payment(req.body)
    res.status(201).send(result)
  } catch (error) {
    res.status(400).send(error)
  }
});