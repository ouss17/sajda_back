const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getConnection } = require("../models/connection_mysql");
const {
  getUserByPseudoOrEmail,
  getUserById,
  createUser,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
  getUsers,
  updateExternal,
} = require("../modules/queries/users_query");
const {
  isValidPassword,
  isValidEmail,
  isValidDateFormat,
} = require("../modules/checkFieldRegex");

const JWT_SECRET = process.env.JWT_SECRET || "vd56zd54-afd3-4063-97dd-5f2d2sd45df4";

// Service pour inscrire un utilisateur
exports.signupUser = async (userData) => {
  const { pseudo, email, password, firstname, lastname, birthDate, externalId } = userData;

  // Vérifications des formats
  if (!pseudo || !email || !password || !birthDate || !externalId) {
    throw new Error("Champs manquants ou vides.");
  }

  if (!isValidEmail(email)) {
    throw new Error("Veuillez entrer un email valide.");
  }

  if (!isValidPassword(password)) {
    throw new Error(
      `Veuillez écrire un mot de passe qui correspond à une de ces conditions :
      - 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.`
    );
  }

  if (!isValidDateFormat(birthDate)) {
    throw new Error("La date entrée est incorrecte.");
  }

  const con = await getConnection();
  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await getUserByPseudoOrEmail(con, [email, pseudo]);
    if (existingUser.length > 0) {
      throw new Error("L'utilisateur existe déjà !");
    }

    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const result = await createUser(con, [
      pseudo,
      email,
      hash,
      firstname,
      lastname,
      birthDate,
      externalId,
    ]);

    return result;
  } finally {
    if (con) con.release();
  }
};

// Service pour connecter un utilisateur
exports.signinUser = async (pseudo, password, externalId) => {
  const con = await getConnection();
  try {
    // Récupère l'utilisateur par pseudo ou email
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);
    if (user.length === 0) {
      throw new Error("Utilisateur introuvable");
    }

    const userRes = user[0];

    // Vérifie le mot de passe
    const comparePasswords = await bcrypt.compare(password, userRes.password);
    if (!comparePasswords) {
      throw new Error("Mot de passe erroné");
    }

    // Met à jour l'externalId si fourni
    if (externalId) {
      await updateExternal(con, [externalId, userRes.id]);
    }

    // Génère un token JWT
    const token = jwt.sign(
      {
        id: userRes.id,
        role: userRes.role,
        email: userRes.email,
        pseudo: userRes.pseudo,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: userRes.id,
        pseudo: userRes.pseudo,
        email: userRes.email,
        firstname: userRes.firstname,
        lastname: userRes.lastname,
        role: userRes.role,
        creation_timestamp: userRes.creation_timestamp,
      },
    };
  } finally {
    if (con) con.release();
  }
};

// Service pour récupérer tous les utilisateurs
exports.getAllUsers = async () => {
  const con = await getConnection();
  try {
    const users = await getUsers(con, []);
    return users;
  } finally {
    if (con) con.release();
  }
};

// Service pour récupérer les informations d'un utilisateur authentifié
exports.getAuthenticatedUser = async (pseudo) => {
  const con = await getConnection();
  try {
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);
    if (user.length === 0) {
      throw new Error("Utilisateur introuvable");
    }

    const userRes = user[0];
    return {
      pseudo: userRes.pseudo,
      email: userRes.email,
      firstname: userRes.firstname,
      lastname: userRes.lastname,
      role: userRes.role,
      creation_timestamp: userRes.creation_timestamp,
      birthDate: userRes.birthDate,
    };
  } finally {
    if (con) con.release();
  }
};

// Service pour mettre à jour les informations d'un utilisateur
exports.updateUser = async (userId, currentPseudo, userData) => {
  const { pseudo, firstname, lastname, birthDate } = userData;

  // Vérifications des formats
  if (!pseudo || !firstname || !lastname || !birthDate) {
    throw new Error("Champs manquants ou vides.");
  }

  if (!isValidDateFormat(birthDate)) {
    throw new Error("La date entrée est incorrecte.");
  }

  const con = await getConnection();
  try {
    // Vérifie si l'utilisateur existe
    const existingUser = await getUserById(con, userId);
    
    if (existingUser.length === 0) {
      console.log("existingUser", existingUser);
      
      throw new Error("Utilisateur introuvable.");
    }
    
    const result = await updateUser(con, [pseudo, firstname, lastname, birthDate, userId], currentPseudo, pseudo);
    return result;
  } finally {
    if (con) con.release();
  }
};

// Service pour mettre à jour le rôle d'un utilisateur
exports.updateUserRole = async (userId, role) => {
  if (!role) {
    throw new Error("Le rôle est requis.");
  }

  const con = await getConnection();
  try {
    // Vérifie si l'utilisateur existe
    const existingUser = await getUserById(con, userId);
    if (existingUser.length === 0) {
      throw new Error("Utilisateur introuvable.");
    }


    const result = await updateRole(con, [role, userId]);
    return result;
  } finally {
    if (con) con.release();
  }
};

// Service pour mettre à jour le mot de passe d'un utilisateur
exports.updateUserPassword = async (userId, newPassword) => {
  if (!isValidPassword(newPassword)) {
    throw new Error(
      `Veuillez écrire un mot de passe qui correspond à une de ces conditions :
      - 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.`
    );
  }

  const con = await getConnection();
  try {
    // Vérifie si l'utilisateur existe
    const existingUser = await getUserById(con, userId);
    if (existingUser.length === 0) {
      throw new Error("Utilisateur introuvable.");
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const result = await updatePassword(con, [hash, userId]);
    return result;
  } finally {
    if (con) con.release();
  }
};

// Service pour supprimer un utilisateur
exports.deleteUser = async (userId) => {
  const con = await getConnection();
  try {
    // Vérifie si l'utilisateur existe
    const existingUser = await getUserById(con, userId);
    if (existingUser.length === 0) {
      throw new Error("Utilisateur introuvable.");
    }

    const result = await deleteUser(con, userId);
    return result;
  } finally {
    if (con) con.release();
  }
};