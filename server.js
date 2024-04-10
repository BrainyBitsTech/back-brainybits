// server.js
const express = require('express');
const cors = require('cors');
const userRouter = require('./src/routes/user.routes.js');
const productRouter = require('./src/routes/product.routes.js');
const categoriesRouter = require('./src/routes/categories.routes.js');
const paymentRouter = require('./src/routes/payment.routes.js');
const { client } = require('./db.js');
const port = process.env.PORT || 2000;
const app = express();

app.use(cors());

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Conectado com sucesso ao MongoDB!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
  }
}

app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.use('/api/identity', userRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoriesRouter);
app.use('/api/payment', paymentRouter);

app.listen(port, () => {
  connectToMongoDB();
  console.log(`Servidor rodando na port ${port}`);
});
