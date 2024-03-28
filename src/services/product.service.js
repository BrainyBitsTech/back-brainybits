const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../db');
const { uploadFile } = require('../aws');

const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('products');
};

const createProduct = async (userId, product, images) => {
  console.log('images => ', images)
  console.log('product => ', product)
  try {
    const productCollection = await getCollection();

    const imagesResult = []
    await Promise.all(images.map(async (image) => {
      const result = await uploadFile(image);
      imagesResult.push({ key: result.key, location: result.Location })
    }));
    
    
    const newProduct = {
      title: product.title,
      description: product.description,
      userId: new ObjectId(userId),
      date: new Date(),
      categories: product.categories,
      active: product.active ?? false,
      images: imagesResult,
      variants: await Promise.all(product.variants.map(async (variant, index) => ({
        active: variant.active,
        price: parseFloat(variant.price),
        size: variant.size,
        quantity: parseInt(variant.quantity),
      }))),
    };

    await productCollection.insertOne(newProduct);
    return newProduct;
  } catch (error) {
    throw new Error('Erro ao criar o produto: ' + error.message);
  }
};


const updateProduct = async (userId, productId, updates, images) => {
  try {
    const productCollection = await getCollection();

    let imagePaths = [];
    if (images && images.length > 0) {
      imagePaths = await Promise.all(images.map(async (image) => {
        const result = await uploadFile(image);
        return result.Key;
      }));
    }

    const updatedProduct = {
      ...updates,
      userId: new ObjectId(userId),
      date: new Date(),
      categories: updates.categories || [],
      variants: updates.variants?.map(variant => ({
        ...variant,
        image: variant.images || []
      })) || [],
    };

    const result = await productCollection.updateOne(
      { _id: new ObjectId(productId), userId: new ObjectId(userId) },
      { $set: updatedProduct }
    );

    if (result.matchedCount === 0) {
      throw new Error("Produto não encontrado ou você não tem acesso para editar.");
    }

    if (result.modifiedCount === 0) {
      throw new Error("Nenhuma informação do produto foi atualizada.");
    }

    return { message: "Produto atualizado com sucesso." };
  } catch (error) {
    throw new Error('Erro ao atualizar o produto: ' + error.message);
  }
};

const listProducts = async (userId) => {
  try {
    const productCollection = await getCollection();
    return await productCollection.find({ userId: new ObjectId(userId) }).toArray();
  } catch (error) {
    throw new Error('Erro ao listar os produtos: ' + error.message);
  }
};

const deleteProduct = async (userId, productId) => {
  try {
    const productCollection = await getCollection();
    const result = await productCollection.deleteOne({ _id: new ObjectId(productId), userId: new ObjectId(userId) });
    if (result.deletedCount === 0) {
      throw new Error("Produto não encontrado ou você não tem acesso.");
    }
    return { message: "Produto deletado com sucesso." };
  } catch (error) {
    throw new Error('Erro ao deletar o produto: ' + error.message);
  }
};

module.exports = { createProduct, updateProduct, listProducts, deleteProduct };
