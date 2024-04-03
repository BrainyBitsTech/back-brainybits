const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../../db');

const SECRET_KEY = 'ae2b6dd9d5361eb5abeb8bb6eff5d2489fc6fea849640244ba10bbdab3dd37201c53b39597d016eea85be3f85c7553b492dbdd031147d4480b0b0ed1d421468a';

const getCollection = async () => {
  const db = await getDatabase('brainybits');
  return db.collection('users');
};

const createUser = async (body) => {
  try {
    const userCollection = await getCollection();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser = {
      name: body.name,
      password: hashedPassword,
      email: body.email,
      admin: body.admin || false,
      cpf: body.cpf,
      phone: body.phone,
      cep: body.cep,
      address: body.address
    }

    await userCollection.insertOne(newUser);
    return newUser
  } catch (errro) {
    res.status(400).send(error);
  }
};

const listUsers = async (req, res) => {
  try {
    const userCollection = await getCollection();
    const users = await userCollection.find({}).toArray();

    return users
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req) => {
  try {
    const userCollection = await getCollection();
    const result = await userCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    
    return result
  } catch (error) {
    res.status(500).send(error);
  }
};

const authenticateUser = async (req, res) => {
  try {
    const userCollection = await getCollection();
    const { email, password } = req.body;
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).send({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });

    const { password: _, ...userData } = user;

    res.status(200).send({ token, user: userData });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createUser, listUsers, deleteUser, authenticateUser };
