const express = require('express');
const { createProduct, listProducts, deleteProduct, updateProduct } = require('../services/product.service.js');
const multer = require('multer');
const uuid = require("uuid").v4

const productRouter = express.Router();

const storage = multer.diskStorage({ destination: (req, file, cb) => {
  cb(null, "uploads")
},
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${req.params.userId}-${uuid()}-${originalname}`)
  }
})

const upload = multer({ storage });

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

productRouter.get('/:userId/:productId', async (req, res) => {
  try {
    const products = await listProducts(req.params.userId, req.params.productId)
    res.status(200).send(products)
  } catch (error) {
    res.status(400).send(error.message)
  }
})

productRouter.delete('/:userId/:productId', async (req, res) => {
  try {
    const response = await deleteProduct(req.params.userId, req.params.productId);
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
});

productRouter.put('/:userId/:productId', upload.any(), async (req, res) => {
  try {
    const result = await updateProduct(req.params.userId, req.params.productId, req.body, req.files);
    res.status(200).send(result);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});


module.exports = productRouter;