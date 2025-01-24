const { MongoClient } = require("mongodb");
require("dotenv").config();
const client = new MongoClient(process.env.CONNECTION_STRING_MONGO);

let db;

async function connectToDatabase() {
  if (!db) {
    try {
      // Connexion au serveur MongoDB
      await client.connect();
      console.log("Connexion réussie à MongoDB");
      db = client.db("sajda"); // Remplacez par le nom de votre base de données
    } catch (error) {
      console.error("Erreur de connexion :", error);
    }
  }
  return db;
}

// Export de la fonction de connexion
module.exports = {
  connectToDatabase,
};
// const connectionString = process.env.CONNECTION_STRING_MONGO;

// mongoose
//   .connect(connectionString, { connectTimeoutMS: 2000 })
//   .then(() => console.log("✅ Mongo Database connected"))
//   .catch((err) => console.error(err));
