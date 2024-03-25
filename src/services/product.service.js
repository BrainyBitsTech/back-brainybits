// product.service.js
const { ObjectId } = require('mongodb');
const { getDatabase } = require('../..');
const { uploadFile } = require('../aws');

const createProduct = async (userId, product, images) => {  
  const db = await getDatabase();
  const productCollection = db.collection("products");

  let imagePaths = [];

  if(images) {
    imagePaths = await Promise.all(images.map(async (image) => {
      const result = await uploadFile(image);
      return result.Key;
    }));
  }

  const newProduct = {
    title: product.title,
    description: product.description,
    userId: new ObjectId(userId),
    date: new Date(),
    categories: product.categories,
    active: product.active ?? false,
    variants: product.variants.map(variant => ({
      active: variant.active,
      images: variant.images,
      price: variant.price,
      size: variant.size,
      quantity: variant.quantity
    })),
    images: imagePaths
  };

  await productCollection.insertOne(newProduct);
  return newProduct;
};

const updateProduct = async (userId, productId, updates, images) => {
  const db = await getDatabase();
  const productCollection = db.collection("products");

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
};

const listProdutcs = async (userId) => {
  const db = await getDatabase();
  const productCollection = db.collection("products");

  return await productCollection.find({ userId: new ObjectId(userId) }).toArray();
};

const deleteProduct = async (userId, productId) => {
  const db = await getDatabase();
  const productCollection = db.collection("products");

  const result = await productCollection.deleteOne({ _id: new ObjectId(productId), userId: new ObjectId(userId) });
  if (result.deletedCount === 0) {
    throw new Error("Produto não encontrado ou você não tem acesso.");
  }
  return { message: "Produto deletado com sucesso ." };
};

module.exports = { createProduct, updateProduct, listProdutcs, deleteProduct };
