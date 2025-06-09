var express = require("express");
var router = express.Router();
const { auth } = require("../middleware/auth");
const {
  addPost,
  retrievePostsByMosquee,
  retrievePostsAvailable,
  retrieveOnePost,
  retrievePostsByCategory,
  modifyPost,
  removePost,
} = require("../controllers/postsController");

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Ajouter un post
 *     tags: [Posts]
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
 *               - content
 *               - id_category
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               media:
 *                 type: string
 *               id_mosquee:
 *                 type: integer
 *               id_category:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Post créé
 *       400:
 *         description: Champs manquants ou droits insuffisants
 *       403:
 *         description: Accès refusé
 */
router.post("/", auth, addPost);

/**
 * @swagger
 * /posts/mosquee/{mosqueeId}:
 *   get:
 *     summary: Récupérer tous les posts d'une mosquée
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des posts
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/mosquee/:mosqueeId", retrievePostsByMosquee);

/**
 * @swagger
 * /posts/available:
 *   get:
 *     summary: Récupérer tous les posts disponibles
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Liste des posts disponibles
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/available", retrievePostsAvailable);

/**
 * @swagger
 * /posts/post/{postId}:
 *   get:
 *     summary: Récupérer un post par son ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post trouvé
 *       400:
 *         description: Post non trouvé
 */
router.get("/post/:postId", retrieveOnePost);

/**
 * @swagger
 * /posts/category/{mosqueeId}/{categoryId}:
 *   get:
 *     summary: Récupérer tous les posts d'une catégorie pour une mosquée
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: mosqueeId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des posts
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/category/:mosqueeId/:categoryId", retrievePostsByCategory);

/**
 * @swagger
 * /posts/update/{postId}:
 *   put:
 *     summary: Modifier un post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
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
 *               - title
 *               - content
 *               - id_category
 *               - active
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               media:
 *                 type: string
 *               active:
 *                 type: boolean
 *               id_category:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Post modifié
 *       400:
 *         description: Champs manquants ou droits insuffisants
 *       403:
 *         description: Accès refusé
 */
router.put("/update/:postId", auth, modifyPost);

/**
 * @swagger
 * /posts/delete/{postId}:
 *   delete:
 *     summary: Supprimer un post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post supprimé
 *       400:
 *         description: Droits insuffisants ou post non trouvé
 *       403:
 *         description: Accès refusé
 */
router.delete("/delete/:postId", auth, removePost);

module.exports = router;
