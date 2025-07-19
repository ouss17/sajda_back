var express = require("express");
const { auth } = require("../middleware/auth");

const {
  retrieveAllNotifs,
  getOneNotification,
  addNotification,
  modifyNotification,
  removeNotification,
  getLastNotificationByExternalId
} = require("../controllers/notifications");
var router = express.Router();
/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Récupérer toutes les notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: Liste des notifications
 */
router.get("/", retrieveAllNotifs);

/**
 * @swagger
 * /notifications/notification/{notificationId}:
 *   get:
 *     summary: Récupérer une notification par son ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification trouvée
 *       404:
 *         description: Notification non trouvée
 */
router.get("/notification/:notificationId", getOneNotification);

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Ajouter une notification
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification ajoutée
 *       400:
 *         description: Champs manquants ou droits insuffisants
 */
router.post("/", addNotification);

/**
 * @swagger
 * /notifications/update/{notificationId}:
 *   put:
 *     summary: Modifier une notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification modifiée
 *       400:
 *         description: Champs manquants ou droits insuffisants
 *       404:
 *         description: Notification non trouvée
 */
router.put("/update/:notificationId", auth, modifyNotification);

/**
 * @swagger
 * /notifications/delete/{notificationId}:
 *   delete:
 *     summary: Supprimer une notification
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification supprimée
 *       400:
 *         description: Droits insuffisants
 */
router.delete("/delete/:notificationId", auth, removeNotification);

/**
 * @swagger
 * /notifications/external/{externalId}:
 *   get:
 *     summary: Récupérer une notification externe par son ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: externalId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification externe trouvée
 *       404:
 *         description: Notification externe non trouvée
 */
router.get('/external/:externalId', getLastNotificationByExternalId);
module.exports = router;
