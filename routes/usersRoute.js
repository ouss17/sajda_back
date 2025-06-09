var express = require("express");
const { auth } = require("../middleware/auth");
const {
  signin,
  signup,
  removeUser,
  modifyUser,
  logout,
  modifyPassword,
  modifyRole,
  getMe,
  retrieveUsers,
} = require("../controllers/usersController");
var router = express.Router();

/**
 * @swagger
 * /users/signup:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - email
 *               - password
 *               - birthDate
 *               - externalId
 *             properties:
 *               pseudo:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               lastname:
 *                 type: string
 *               firstname:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *               externalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation ou utilisateur existant
 */
router.post("/signup", signup);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     summary: Connecter un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - password
 *             properties:
 *               pseudo:
 *                 type: string
 *               password:
 *                 type: string
 *               externalId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur connecté
 *       400:
 *         description: Erreur d'authentification
 */
router.post("/signin", signin);

/**
 * @swagger
 * /users/getMe:
 *   get:
 *     summary: Récupérer les infos de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur
 *       400:
 *         description: Erreur
 */
router.get("/getMe", auth, getMe);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *       403:
 *         description: Accès refusé
 */
router.get("/", auth, retrieveUsers);

/**
 * @swagger
 * /users/update/{userId}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - pseudo
 *               - firstname
 *               - lastname
 *               - birthDate
 *             properties:
 *               pseudo:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *       400:
 *         description: Erreur de validation
 */
router.put("/update/:userId", auth, modifyUser);

/**
 * @swagger
 * /users/updatePassword/{userId}:
 *   put:
 *     summary: Modifier le mot de passe d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - newPassword
 *               - confirmPassword
 *               - lastPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               lastPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *       400:
 *         description: Erreur de validation
 */
router.put("/updatePassword/:userId", auth, modifyPassword);

/**
 * @swagger
 * /users/updateRole/{userId}:
 *   put:
 *     summary: Modifier le rôle d'un utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rôle modifié
 *       400:
 *         description: Erreur de validation
 *       403:
 *         description: Accès refusé
 */
router.put("/updateRole/:userId", auth, modifyRole);

/**
 * @swagger
 * /users/delete/{userId}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
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
 *         description: Utilisateur supprimé
 *       403:
 *         description: Accès refusé
 */
router.delete("/delete/:userId", auth, removeUser);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Déconnexion de l'utilisateur
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Déconnecté
 */
router.get("/logout", auth, logout);
module.exports = router;
