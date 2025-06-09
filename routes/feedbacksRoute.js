var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addFeedback,
  retrieveOneFeedback,
  retrieveFeedbacksByMosquee,
  retrieveFeedbacksByUser,
  retrieveFeedbacksByTarget,
  modifyFeedback,
  removeFeedback,
} = require("../controllers/feedbacksController");

/**
 * @swagger
 * /feedbacks:
 *   post:
 *     summary: Ajouter un feedback
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - detail
 *               - target
 *             properties:
 *               title:
 *                 type: string
 *               detail:
 *                 type: string
 *               target:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback créé
 *       400:
 *         description: Champs manquants ou droits insuffisants
 */
router.post("/", auth, addFeedback);

/**
 * @swagger
 * /feedbacks/feedback/{feedbackId}:
 *   get:
 *     summary: Récupérer un feedback par son ID
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback trouvé
 *       400:
 *         description: Feedback non trouvé
 */
router.get("/feedback/:feedbackId", auth, retrieveOneFeedback);

/**
 * @swagger
 * /feedbacks/mosquee/{mosqueeId}:
 *   get:
 *     summary: Récupérer tous les feedbacks d'une mosquée
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/mosquee/:mosqueeId", auth, retrieveFeedbacksByMosquee);

/**
 * @swagger
 * /feedbacks/user/{userId}:
 *   get:
 *     summary: Récupérer tous les feedbacks d'un utilisateur
 *     tags: [Feedbacks]
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
 *         description: Liste des feedbacks
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/user/:userId", auth, retrieveFeedbacksByUser);

/**
 * @swagger
 * /feedbacks/target/{mosqueeId}/{target}:
 *   get:
 *     summary: Récupérer tous les feedbacks d'une mosquée pour une cible donnée
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: target
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des feedbacks
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/target/:mosqueeId/:target", auth, retrieveFeedbacksByTarget);

/**
 * @swagger
 * /feedbacks/update/{feedbackId}:
 *   put:
 *     summary: Modifier un feedback
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: feedbackId
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
 *               - checked
 *               - responded
 *             properties:
 *               checked:
 *                 type: boolean
 *               responded:
 *                 type: string
 *     responses:
 *       200:
 *         description: Feedback modifié
 *       400:
 *         description: Droits insuffisants ou feedback non trouvé
 */
router.put("/update/:feedbackId", auth, modifyFeedback);

/**
 * @swagger
 * /feedbacks/delete/{feedbackId}:
 *   delete:
 *     summary: Supprimer un feedback
 *     tags: [Feedbacks]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: feedbackId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback supprimé
 *       400:
 *         description: Droits insuffisants ou feedback non trouvé
 */
router.delete("/delete/:feedbackId", auth, removeFeedback);

module.exports = router;
