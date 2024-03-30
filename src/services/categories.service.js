const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../db');
const { uploadFile } = require('../aws');

const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('categories');
};

const createCategories = async (userId, category, images) => {
  try {
    const categoriesCollection = await getCollection();

    const imagesResult = []
    await Promise.all(images.map(async (image) => {
      const result = await uploadFile(image);
      imagesResult.push({ key: result.key, location: result.location })
    }));

    const updateCategory = {
      userId: new ObjectId(userId),
      title: category.title,
      value: category.value,
      image: imagesResult
    }

    const newCategory = await categoriesCollection.insertOne(updateCategory);
    return newCategory;
  } catch (error) {
    throw new Error('Erro ao criar a categoria: ' + error.message);
  }
};

const updateCategory = async (userId, categoryId, updates, images)  => {
  try {
    const categoriesCollection = await getCollection();

    const existingCategory = await categoriesCollection.findOne({
      _id: new ObjectId(categoryId),
      userId: new ObjectId(userId)
    })

    if(!existingCategory) {
      throw new Error("Categoria não encontrada ou você não tem acesso apra editar!")
    }

    let updatedCategory = { ...existingCategory, ...updates}

    if (images && images.length > 0) {
      const newImages = await Promise.all(images.map(async (image) => {
        const result = await uploadFile(image);
        return { key: result.key, location: result.location };
      }));
      updatedCategory.images = [...updatedProduct.images, ...newImages];
    }


    const result = await categoriesCollection.updateOne(
      { _id: new ObjectId(categoryId), userId: new ObjectId(userId) },
      { $set: updatedCategory }
    );

    if (result.matchedCount === 0) {
      throw new Error("Categoria não encontrada.");
    }

    return { message: "Categoria atualizada com sucesso." };
  } catch (error) {
    throw new Error('Erro ao atualizar a categoria: ' + error.message);
  }
};

const deleteCategory = async (userId, categoryId) => {
  try {
    const categoriesCollection = await getCollection();
    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId), userId: new ObjectId(userId) });

    if (result.deletedCount === 0) {
      throw new Error("Categoria não encontrada ou já foi deletada.");
    }

    return { message: "Categoria deletada com sucesso." };
  } catch (error) {
    throw new Error('Erro ao deletar a categoria: ' + error.message);
  }
};

const listCategories = async (userId, categoryId) => {
  try {
    const categoriesCollection = await getCollection();
    let categories = []

    if (categoryId) {
      const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId), userId: new ObjectId(userId) });
      categories.push(category)
    } else {
      categories = await categoriesCollection.find({ userId: new ObjectId(userId) }).toArray();
    }

    // const updatedCategory = await Promise.all(categories.map(async (e) => {
    //   console.log('e => ', e)
    //   const images = await Promise.all(e.image.map(async (s) => {
    //     console.log('s => ', s)
    //     const stream = await getFileStream(s.key);
    //     console.log("🚀 ~ images ~ stream:", stream)
    //     return { key: s.key, stream };
    //   }));
    //   console.log("🚀 ~ images ~ images:", images)
      
    //   categories[i].image = images
    // }));

    return categories
  } catch (error) {
    throw new Error('Erro ao listar as categorias: ' + error.message);
  }
};

module.exports = { createCategories, updateCategory, deleteCategory, listCategories };

