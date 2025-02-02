const { connectToDatabase } = require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const { ObjectId } = require('mongodb');

exports.retrieveAllNotifs = async (req, res) => {
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    const allNotifications = await notifications.find().toArray();
    res.json({ result: true, data: allNotifications });
  } catch (error) {
    console.error("Erreur :", error);
  }
};


exports.getOneNotification = async (req, res) => {
  
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");

    //use ObjectId to find the notification
    const notificationId = new ObjectId(req.params.notificationId);

    const notification = await notifications.findOne({
      _id: notificationId,
    });
    res.json({ result: true, data: notification });
  } catch (error) {
    console.error("Erreur :", error);
  }
};


exports.addNotification = async (req, res) => {
  let { message} = req.body;
  if (!checkBody(req.body, ["message"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }
  if(req.user.role !== "admin" || req.user.role === "gerant") {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour ajouter une notification !",
    });
  }
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    const result = await notifications.insertOne({ message });
    res.json({ result: true, response: "Notification ajoutée", data: result });
  } catch (error) {
    console.error("Erreur :", error);
  }
};
exports.modifyNotification = async (req, res) => {
  const { notificationId } = req.params;
  const { message } = req.body;

  const notification = new ObjectId(notificationId);
  

  if (!checkBody(req.body, ["message"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if(req.user.role !== "admin" || req.user.role === "gerant") {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier une notification !",
    });
  }

  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    const result = await notifications.updateOne(
      { _id: notification },
      { $set: { message } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        result: false,
        error: "Notification non trouvée.",
      });
    }

    res.json({ result: true, response: "Notification modifiée", data: result });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ result: false, error: "Erreur serveur." });
  }
};
exports.removeNotification = async (req, res) => {
  const { notificationId } = req.params;
  if(req.user.role !== "admin" || req.user.role === "gerant") {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer une notification !",
    });
  }
  try {
    const db = await connectToDatabase();
    const notifications = db.collection("notifications");
    const result = await notifications.deleteOne({ _id: notificationId });
    res.json({ result: true, response: "Notification supprimée", data: result });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ result: false, error: "Erreur serveur." });
  }
};
