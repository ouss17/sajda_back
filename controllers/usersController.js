const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkBody } = require("../modules/checkBody");
const {
  isValidPassword,
  isValidEmail,
  isValidDateFormat,
} = require("../modules/checkFieldRegex");
const {
  signupUser,
  signinUser,
  getAllUsers,
  getAuthenticatedUser,
  updateUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
  getUserByIdService,
} = require("../services/usersService");
const JWT_SECRET = process.env.JWT_SECRET;
const { getConnection } = require('../models/connection_mysql');

exports.signup = async (req, res) => {
  try {
    const result = await signupUser(req.body);
    res.json({ result: true, response: "Utilisateur créé" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const { pseudo, password, externalId } = req.body;
    const { token, user } = await signinUser(pseudo, password, externalId);

    res
      .cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({ result: true, data: user, message: "Utilisateur connecté", token });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.retrieveUsers = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== "admin" && role !== "gerant") {
      return res.status(403).json({
        result: false,
        error: "Vous n'avez pas les droits pour récupérer les utilisateurs !",
      });
    }

    const users = await getAllUsers();
    res.json({ result: true, data: users });
  } catch (error) {
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req.user.pseudo);
    res.json({ result: true, data: user });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.modifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { pseudo: currentPseudo, id: currentId, role: currentRole, email: currentEmail } = req.user;
    const { pseudo, firstname, lastname, birthDate } = req.body;

    if (!pseudo || !firstname || !lastname) {
      return res.status(400).json({ result: false, error: "Champs manquants ou vides." });
    }


    if (birthDate && !isValidDateFormat(birthDate)) {
      return res.status(400).json({ result: false, error: "La date entrée est incorrecte." });
    }

    const result = await updateUser(userId, currentPseudo, req.body);

    if (currentId == userId) {
      // Génère un nouveau token si l'utilisateur modifie ses propres données
      const token = jwt.sign(
        {
          id: currentId,
          role: currentRole,
          email: currentEmail,
          pseudo,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res
        .cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({ result: true, response: "Utilisateur modifié", token });
    } else {
      res.json({ result: true, response: "Utilisateur modifié" });
    }
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.modifyRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const { role: currentRole } = req.user;

    if (!role) {
      return res.status(400).json({ result: false, error: "Le rôle est requis." });
    }

    if (currentRole !== "admin" && role === "admin") {
      return res.status(403).json({
        result: false,
        error: "Vous ne possédez pas les droits pour passer un utilisateur en admin.",
      });
    }

    const result = await updateUserRole(userId, role);
    res.json({ result: true, response: "Rôle de l'utilisateur modifié" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.modifyPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword, confirmPassword, lastPassword } = req.body;
    const { pseudo: currentPseudo } = req.user;

    if (!isValidPassword(newPassword) || !isValidPassword(confirmPassword) || !isValidPassword(lastPassword)) {
      return res.status(400).json({
        result: false,
        error: "Le mot de passe doit respecter les critères de sécurité.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        result: false,
        error: "Le nouveau mot de passe et sa confirmation doivent être identiques.",
      });
    }

    const result = await updateUserPassword(userId, newPassword);
    res.json({ result: true, response: "Mot de passe modifié" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id: currentId, role: currentRole } = req.user;

    if (currentRole !== "admin" && currentId != userId) {
      return res.status(403).json({
        result: false,
        error: "Vous n'avez pas les droits pour supprimer cet utilisateur !",
      });
    }

    const result = await deleteUser(userId);

    if (currentId == userId) {
      res
        .clearCookie("jwt")
        .json({ result: true, response: "Votre compte a été supprimé." });
    } else {
      res.json({ result: true, response: "Utilisateur supprimé" });
    }
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
};

exports.retrieveUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await getUserByIdService(userId);
    if (!user) {
      return res.status(404).json({ result: false, error: "Utilisateur non trouvé." });
    }
    res.json({ result: true, data: user });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
};
