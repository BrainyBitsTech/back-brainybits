const express = require('express');
const { createProduct, listProdutcs, deleteProduct } = require('../services/product.service.js');

const productRouter = express.Router();

productRouter.post('/:userId', async (req, res) => {
  try {
    const product = await createProduct(req.params.userId, req.body); 
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

productRouter.get('/:userId', async (req, res) => {
  try {
    const products = await listProdutcs(req.params.userId);
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

productRouter.delete('/:userId/:productId', async (req, res) => {
  try {
    const response = await deleteProduct(req.params.userId, req.params.productId);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = productRouter;