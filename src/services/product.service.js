const { ObjectId } = require('mongodb');
const { getDatabase } = require('../../db');
const { uploadFile, getFileStream } = require('../aws');


const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('products');
};

const createProduct = async (userId, product, images) => {
  try {
    const productCollection = await getCollection();

    const imagesResult = []
    await Promise.all(images.map(async (image) => {
      const result = await uploadFile(image);
      imagesResult.push({ key: result.key, location: result.location })
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

    const existingProduct = await productCollection.findOne({
      _id: new ObjectId(productId),
      userId: new ObjectId(userId)
    });

    if (!existingProduct) {
      throw new Error("Produto não encontrado ou você não tem acesso para editar.");
    }

    let updatedProduct = { ...existingProduct, ...updates };

    if (images && images.length > 0) {
      const newImages = await Promise.all(images.map(async (image) => {
        const result = await uploadFile(image);
        return { key: result.key, location: result.location };
      }));
      updatedProduct.images = [...updatedProduct.images, ...newImages];
    }

    if (updatedProduct.variants) {
      updatedProduct.variants = updatedProduct.variants.map(variant => ({
        ...variant,
        price: parseFloat(variant.price),
        quantity: parseInt(variant.quantity),
        active: variant.active ?? true,
        size: variant.size ?? ''
      }));
    }

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

const listProducts = async (userId, productId) => {
  try {
    const productCollection = await getCollection();
    let products = []

    if (productId) {
      const product = await productCollection.findOne({ _id: new ObjectId(productId), userId: new ObjectId(userId) })
      products.push(product)
    } else {
      products = await productCollection.find({ userId: new ObjectId(userId) }).toArray()
    }

    const updatedProducts = await Promise.all(products.map(async (e) => {
      const images = await Promise.all(e.images.map(async (s) => {
        const stream = await getFileStream(s.key);
        return { key: s.key, stream };
      }));
      return { ...e, images };
    }));


    return updatedProducts
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
