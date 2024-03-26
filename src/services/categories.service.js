const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../db');

const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('categories');
};

const createCategories = async (category) => {
  try {
    const categoriesCollection = await getCollection();
    const newCategory = await categoriesCollection.insertOne(category);
    return newCategory;
  } catch (error) {
    throw new Error('Erro ao criar a categoria: ' + error.message);
  }
};

const updateCategory = async (categoryId, updates) => {
  try {
    const categoriesCollection = await getCollection();
    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(categoryId) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      throw new Error("Categoria não encontrada.");
    }

    return { message: "Categoria atualizada com sucesso." };
  } catch (error) {
    throw new Error('Erro ao atualizar a categoria: ' + error.message);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const categoriesCollection = await getCollection();
    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId) });

    if (result.deletedCount === 0) {
      throw new Error("Categoria não encontrada ou já foi deletada.");
    }

    return { message: "Categoria deletada com sucesso." };
  } catch (error) {
    throw new Error('Erro ao deletar a categoria: ' + error.message);
  }
};

const listCategories = async (categoryId) => {
  try {
    const categoriesCollection = await getCollection();
    if (categoryId) {
      return await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });
    }
    return await categoriesCollection.find({}).toArray();
  } catch (error) {
    throw new Error('Erro ao listar as categorias: ' + error.message);
  }
};

module.exports = { createCategories, updateCategory, deleteCategory, listCategories };

