
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../server');

const createCategories = async (category) => {
  const db = await getDatabase();
  const categoriesCollection = db.collection("categories");
  const newCategory = {
    value: category.value,
    label: category.label
  };

  await categoriesCollection.insertOne(newCategory);
  return newCategory;
};

const updateCategory = async (categoryId, updates) => {
  const db = await getDatabase();
  const categoriesCollection = db.collection("categories");
  const result = await categoriesCollection.updateOne(
    { _id: new ObjectId(categoryId) },
    { $set: updates }
  );

  if (result.matchedCount === 0) {
    throw new Error("Categoria não encontrada.");
  }

  return { message: "Categoria atualizada com sucesso." };
};

const deleteCategory = async (categoryId) => {  
  const db = await getDatabase();
  const categoriesCollection = db.collection("categories");
  const result = await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId) });

  if (result.deletedCount === 0) {
    throw new Error("Categoria não encontrada ou já foi deletada.");
  }

  return { message: "Categoria deletada com sucesso." };
};

const listCategories = async (categoryId) => {
  const db = await getDatabase();
  const categoriesCollection = db.collection("categories");
  if (categoryId) {
    return await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });
  }
  return await categoriesCollection.find({}).toArray();
};

module.exports = { createCategories, updateCategory, deleteCategory, listCategories };
