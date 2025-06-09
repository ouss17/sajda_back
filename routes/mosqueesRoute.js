var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addMosquee,
  retrieveMosquee,
  retrieveAllAvailableMosquee,
  retrieveCsv,
  modifyMosquee,
  removeMosquee,
} = require("../controllers/mosqueesController");

/**
 * @swagger
 * /mosquees:
 *   post:
 *     summary: Ajouter une mosquée
 *     tags: [Mosquees]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - zip
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mosquée créée
 *       400:
 *         description: Champs manquants ou date invalide
 *       403:
 *         description: Accès refusé
 */
router.post("/", auth, addMosquee);

/**
 * @swagger
 * /mosquees/{mosqueeId}:
 *   get:
 *     summary: Récupérer une mosquée par son ID
 *     tags: [Mosquees]
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mosquée trouvée
 *       400:
 *         description: Mosquée non trouvée
 */
router.get("/:mosqueeId", retrieveMosquee);

/**
 * @swagger
 * /mosquees:
 *   get:
 *     summary: Récupérer toutes les mosquées disponibles
 *     tags: [Mosquees]
 *     responses:
 *       200:
 *         description: Liste des mosquées
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", retrieveAllAvailableMosquee);

/**
 * @swagger
 * /mosquees/csv/{mosqueeId}/{year}:
 *   get:
 *     summary: Récupérer le fichier CSV des horaires d'une mosquée pour une année donnée
 *     tags: [Mosquees]
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fichier CSV récupéré
 *       404:
 *         description: Fichier non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/csv/:mosqueeId/:year", retrieveCsv);

/**
 * @swagger
 * /mosquees/update/{mosqueeId}:
 *   put:
 *     summary: Modifier une mosquée
 *     tags: [Mosquees]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: mosqueeId
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
 *               - name
 *               - address
 *               - city
 *               - zip
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               zip:
 *                 type: string
 *               country:
 *                 type: string
 *               dateCreated:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Mosquée modifiée
 *       400:
 *         description: Champs manquants ou date invalide
 *       403:
 *         description: Accès refusé
 */
router.put("/update/:mosqueeId", auth, modifyMosquee);

/**
 * @swagger
 * /mosquees/delete/{mosqueeId}:
 *   delete:
 *     summary: Supprimer une mosquée
 *     tags: [Mosquees]
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
 *         description: Mosquée supprimée
 *       400:
 *         description: Mosquée non trouvée
 *       403:
 *         description: Accès refusé
 */
router.delete("/delete/:mosqueeId", auth, removeMosquee);

module.exports = router;
