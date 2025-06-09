var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addResponse,
  retrieveOneResponse,
  retrieveResponsesByUser,
  modifyResponse,
  removeResponse,
} = require("../controllers/responsesController");

/**
 * @swagger
 * /responses:
 *   post:
 *     summary: Ajouter une réponse à un feedback
 *     tags: [Responses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *               - idFeedback
 *               - idUserWhoAsk
 *             properties:
 *               response:
 *                 type: string
 *               idFeedback:
 *                 type: integer
 *               idUserWhoAsk:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Réponse ajoutée
 *       400:
 *         description: Champs manquants ou droits insuffisants
 */
router.post("/", auth, addResponse);

/**
 * @swagger
 * /responses/response/{responseId}:
 *   get:
 *     summary: Récupérer une réponse par son ID
 *     tags: [Responses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réponse trouvée
 *       400:
 *         description: Réponse non trouvée
 */
router.get("/response/:responseId", auth, retrieveOneResponse);

/**
 * @swagger
 * /responses/user/{userId}:
 *   get:
 *     summary: Récupérer toutes les réponses d'un utilisateur
 *     tags: [Responses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des réponses
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/user/:userId", auth, retrieveResponsesByUser);

/**
 * @swagger
 * /responses/update/{responseId}:
 *   put:
 *     summary: Modifier une réponse
 *     tags: [Responses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Réponse modifiée
 *       400:
 *         description: Champs manquants ou droits insuffisants
 */
router.put("/update/:responseId", auth, modifyResponse);

/**
 * @swagger
 * /responses/delete/{responseId}:
 *   delete:
 *     summary: Supprimer une réponse
 *     tags: [Responses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: responseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Réponse supprimée
 *       400:
 *         description: Droits insuffisants ou réponse non trouvée
 */
router.delete("/delete/:responseId", auth, removeResponse);

module.exports = router;
