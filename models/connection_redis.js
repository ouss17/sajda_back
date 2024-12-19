const redis = require("redis");

//Créer un client Redis
const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 12881,
  },
});

// //Gestion des événements
client.on("connect", () => {
  console.log("✅ Connexion réussie à Redis");
});

client.on("error", (err) => {
  console.error("❌ Erreur de connexion à Redis :", err);
});

const tests = async () => {
  try {
    await client.connect();

    // Définir une clé
    //   await client.set("mykey", "Hello Redis!");
    //   console.log("Clé ajoutée : mykey");

    //   // Récupérer la clé
    //   const value = await client.get("mykey");
    //   console.log("Valeur récupérée :", value); // Devrait afficher "Hello Redis!"

    //   // Déconnexion propre
    //   await client.quit();
    //   console.log("🚪 Déconnexion de Redis");
  } catch (err) {
    console.error("Erreur :", err);
  }
};

tests();
