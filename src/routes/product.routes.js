const express = require('express');
const { createProduct, listProducts, deleteProduct } = require('../services/product.service.js');
const multer = require('multer');

const productRouter = express.Router();
const upload = multer({ dest: 'uploads/' });

productRouter.post('/:userId', upload.any(), async (req, res) => {
  try {
    const result = await createProduct(req.params.userId, req.body, req.files);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

productRouter.get('/:userId', async (req, res) => {
  try {
    const products = await listProducts(req.params.userId);
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