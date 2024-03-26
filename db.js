const { MongoClient, ServerApiVersion } = require('mongodb');

const mongouri = "mongodb+srv://admin:19961994MeT@cluster0.hihxnf3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function getDatabase(databaseName) {
    const client = new MongoClient(mongouri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await client.connect();
    return client.db(databaseName);
}

const client = new MongoClient(process.env.MONGODB_URI || mongouri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

module.exports = { client, getDatabase };
