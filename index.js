// server.js
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const userRouter = require('./src/routes/user.routes.js');
const productRouter = require('./src/routes/product.routes');
const categoriesRouter = require('./src/routes/categories.routes');
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
const uri = "mongodb+srv://admin:19961994MeT@cluster0.hihxnf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
let dbClient = null;

export const getDatabase = async () => {
  if (!dbClient) {
    await connectToMongoDB();
    dbClient = client.db("brainybits");
  }
  return dbClient;
};

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

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


app.listen(port, () => {
  connectToMongoDB();
  console.log(`Servidor rodando na port ${port}`);
});
