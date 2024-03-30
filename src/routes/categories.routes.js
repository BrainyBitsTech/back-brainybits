const express = require('express');
const { createCategories, deleteCategory, listCategories, updateCategory } = require('../services/categories.service');
const multer = require('multer');
const uuid = require("uuid").v4;

const categoriesRouter = express.Router();

const storage = multer.diskStorage({ destination: (req, file, cb) => {
  cb(null, "categories")
},
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`)
  }
})

const upload = multer({ storage });

categoriesRouter.post('/:userId', upload.any("file", 1), async (req, res) => {
  try {
    const category = await createCategories(req.params.userId, req.body, req.files);
    res.status(201).send(category);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.get('/:userId', async (req, res) => {
  try {
    const categories = await listCategories(req.params.userId);
    res.status(200).send(categories);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.get('/:userId/:categoryId', async (req, res) => {
  try {
    const category = await listCategories(req.params.userId, req.params.categoryId);
    res.status(200).send(category);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.put('/:userId/:categoryId', async (req, res) => {
  try {
    const response = await updateCategory(req.params.userId, req.params.categoryId, req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.delete('/:userId/:categoryId', async (req, res) => {
  try {
    const response = await deleteCategory(req.params.userId, req.params.categoryId);
    res.status(200).send(response);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

module.exports = categoriesRouter;