const express = require('express');
const { createCategories, deleteCategory, listCategories, updateCategory } = require('../services/categories.service');

const categoriesRouter = express.Router();

categoriesRouter.post('/', async (req, res) => {
  try {
    const category = await createCategories(req.body);
    res.status(201).send(category);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.get('/:categoryId', async (req, res) => {
  try {
    const category = await listCategories(req.params.categoryId);
    res.status(200).send(category);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.put('/:categoryId', async (req, res) => {
  try {
    const response = await updateCategory(req.params.categoryId, req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.delete('/:categoryId', async (req, res) => {
  try {
    const response = await deleteCategory(req.params.categoryId);
    res.status(200).send(response);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

categoriesRouter.get('/', async (req, res) => {
  try {
    const categories = await listCategories();
    res.status(200).send(categories);
  } catch (error) {
    console.log('error => ', error)
    res.status(400).send(error);
  }
});

module.exports = categoriesRouter;