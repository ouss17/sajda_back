const { connectToDatabase } = require("../models/connection");
const { checkBody } = require("../modules/checkBody");

exports.retrieveAllNotifs = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    // Exemple : Récupérer toutes les notifications
    const allNotifications = await notifications.find().toArray();
    res.json({ result: true, data: allNotifications });

    // Exemple : Insérer une notification (facultatif)
    // const result = await notifications.insertOne({ message: "Nouvelle notification", date: new Date() });
    // console.log("Notification insérée :", result.insertedId);
  } catch (error) {
    console.error("Erreur :", error);
  }
};
exports.getOneNotification = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    const notification = await notifications.findOne({
      _id: req.params.notificationId,
    });
    res.json({ result: true, data: notification });
  } catch (error) {
    console.error("Erreur :", error);
  }
};
exports.addNotification = (req, res) => {};
exports.modifyNotification = (req, res) => {};
exports.removeNotification = (req, res) => {};
