var express = require("express");
const { auth } = require("../middleware/auth");
const {
  addCategory,
  retrieveCategories,
  modifyCategory,
  removeCategory,
} = require("../controllers/categoriesController");
var router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Ajouter une catégorie
 *     tags: [Categories]
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
 *               - urlName
 *             properties:
 *               name:
 *                 type: string
 *               comment:
 *                 type: string
 *               urlName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie ajoutée
 *       400:
 *         description: Champs manquants ou vides
 *       403:
 *         description: Accès refusé
 */
router.post("/", auth, addCategory);

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupérer toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", retrieveCategories);

/**
 * @swagger
 * /categories/update/{urlCategory}:
 *   put:
 *     summary: Modifier une catégorie
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: urlCategory
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               comment:
 *                 type: string
 *               urlName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie modifiée
 *       400:
 *         description: Champs manquants ou vides
 *       403:
 *         description: Accès refusé
 */
router.put("/update/:urlCategory", auth, modifyCategory);

/**
 * @swagger
 * /categories/delete/{urlCategory}:
 *   delete:
 *     summary: Supprimer une catégorie
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: urlCategory
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Catégorie supprimée
 *       403:
 *         description: Accès refusé
 */
router.delete("/delete/:urlCategory", auth, removeCategory);
module.exports = router;
