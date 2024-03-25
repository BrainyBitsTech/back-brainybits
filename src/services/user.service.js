// user.service.js
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../..');

const SECRET_KEY = 'ae2b6dd9d5361eb5abeb8bb6eff5d2489fc6fea849640244ba10bbdab3dd37201c53b39597d016eea85be3f85c7553b492dbdd031147d4480b0b0ed1d421468a';

const createUser = async (req, res) => {
  const db = await getDatabase();
  const userCollection = db.collection("users");
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await userCollection.insertOne({
      ...req.body,
      password: hashedPassword
    });
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
};

const listUsers = async (req, res) => {
  const db = await getDatabase();
  const userCollection = db.collection("users");
  try {
    const users = await userCollection.find({}).toArray();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUser = async (req, res) => {
  const db = await getDatabase();
  const userCollection = db.collection("users");
  try {
    const result = await userCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Usuário não encontrado' });
    }
    res.status(200).send({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    res.status(500).send(error);
  }
}

const authenticateUser = async (req, res) => {
  const db = await getDatabase();
  const userCollection = db.collection("users");
  try {
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