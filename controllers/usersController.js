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
      return res.status(400).json({
        result: false,
        error: "Vous n'avez pas les droits pour récupérer les utilisateurs !",
      });
    }

    const users = await getAllUsers();
    res.json({ result: true, data: users });
  } catch (error) {
    res.status(500).json({ result: false, error: "Internal server error." });
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
    const { currentPseudo, userId } = req.params;
    const result = await updateUser(userId, currentPseudo, req.body);
    res.json({ result: true, response: "Utilisateur modifié" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.modifyRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const result = await updateUserRole(userId, role);
    res.json({ result: true, response: "Utilisateur modifié" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.modifyPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const result = await updateUserPassword(userId, newPassword);
    res.json({ result: true, response: "Mot de passe modifié" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.removeUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await deleteUser(userId);
    res.json({ result: true, response: "Utilisateur supprimé" });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
};
