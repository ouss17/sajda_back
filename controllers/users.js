const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { checkBody } = require("../modules/checkBody");
const {
  isValidPassword,
  isValidEmail,
  isValidDateFormat,
} = require("../modules/checkFieldRegex");
const {
  getUserByPseudoOrEmail,
  createUser,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
  getUsers
} = require("../modules/queries/users_query");
const JWT_SECRET = process.env.JWT_SECRET;
const { getConnection } = require('../models/connection_mysql');

/**
 * Create a user if user is "admin"
 * @param {Object} req - The request object
 * @param {Object} req.body - The request body
 * @param {Object} res - The response object
 * @returns {Object} - The response object
 * @throws {Error} - If an error occurred in the database, if authentication failed, or if required fields are empty
 */
exports.signup = async (req, res) => {
  const {
    pseudo,
    email,
    password,
    lastname,
    firstname,
    birthDate,
    external_id,
  } = req.body;

  if (
    !checkBody(req.body, [
      "pseudo",
      "email",
      "password",
      "birthDate",
      "external_id",
    ])
  ) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }

  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ result: false, error: "Veuillez entrer un email valide." });
  }
  if (!isValidPassword(password)) {
    return res.status(400).json({
      result: false,
      error:
        `Veuillez écrire un mot de passe qui correspond à une de ces conditions :
        - 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
        - 14 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
        - 7 mots séparés par un espace.`,
    });
  }

  if (!isValidDateFormat(birthDate)) {
    return res
      .status(400)
      .json({ result: false, error: "La date entrée est incorrecte." });
  }

  let con;
  try {
    con = await getConnection();
    const user = await getUserByPseudoOrEmail(con, [email, pseudo]);

    if (user.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      try {
        const createQuery = await createUser(con, [
          pseudo,
          email,
          hash,
          firstname,
          lastname,
          birthDate,
          external_id,
        ]);
        if (createQuery.affectedRows === 1) {
          res.json({
            result: true,
            response: "Utilisateur créé",
          });
        }
      } catch (error) {
        console.error("Error during signup:", error);
        res
          .status(500)
          .json({ result: false, error: "Internal server error during fetch." });
      }
    } else {
      // User already exists in database
      res.json({ result: false, error: "L'utilisateur existe déjà !" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ result: false, error: "Internal server error during create." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Connect user to the database
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} - The response object with a token
 * @throws {Error} - If an error occurred in the database, if authentication failed, or if required fields are empty
 */
exports.signin = async (req, res) => {
  const { pseudo, password } = req.body;

  if (!checkBody(req.body, ["pseudo", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }
  if (!isValidPassword(password)) {
    return res.status(500).json({
      result: false,
      error:
      `Veuillez écrire un mot de passe qui correspond à une de ces conditions :
      - 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
      - 14 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
      - 7 mots séparés par un espace.`,
    });
  }
  let con;
  try {
    con = await getConnection();
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);

    if (user.length > 0) {
      const userRes = user[0];
      const comparePasswords = await bcrypt.compare(password, userRes.password);

      if (comparePasswords) {
        const token = jwt.sign(
          {
            id: userRes?.id,
            role: userRes?.role,
            email: userRes?.email,
            pseudo: userRes?.pseudo,
          },

          JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );

        const userSent = {
          pseudo: userRes.pseudo,
          email: userRes.email,
          firstname: userRes.firstname,
          lastname: userRes.lastname,
          role: userRes.role,
          creation_timestamp: userRes.creation_timestamp,
        };

        res
          .cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
          })
          .json({
            result: true,
            data: userSent,
            message: "Utilisateur connecté",
            token,
          });
      } else {
        res.json({ result: false, error: "Mot de passe erroné" });
      }
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  } finally {
    if (con) con.release();
  }
};

exports.retrieveUsers = async (req, res) => {
  const { role } = req.user;
  if (role === "admin" || role === "gerant") {
    let con;
    try {
      con = await getConnection();
      const users = await getUsers(con, []);
      res.json({
        result: true,
        data: users,
      });
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    } finally {
      if (con) con.release();
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour récupérer les utilisateurs !",
    });
  }
};

/**
 * Get user authenticated infos
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.getMe = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const user = await getUserByPseudoOrEmail(con, [
      req.user.pseudo,
      req.user.pseudo,
    ]);
    if (user.length > 0) {
      const userRes = user[0];
      const userSent = {
        pseudo: userRes.pseudo,
        email: userRes.email,
        firstname: userRes.firstname,
        lastname: userRes.lastname,
        role: userRes.role,
        creation_timestamp: userRes.creation_timestamp,
        birthDate: userRes.birthDate,
      };
      res.json({
        result: true,
        data: userSent,
      });
    } else {
      res.json({ result: false, error: "Utilisateur introuvable" });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Update a user if authenticated
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyUser = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { pseudo, lastname, firstname, birthDate } = req.body;
  if (!checkBody(req.body, ["pseudo", "birthDate"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }
  if (!isValidDateFormat(birthDate)) {
    return res
      .status(400)
      .json({ result: false, error: "La date entrée est incorrecte." });
  }
  let con;
  try {
    con = await getConnection();
    const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);

    if (currentPseudo == pseudo) {
      if (currentId == req.params.userId) {
        try {
          const updateQuery = await updateUser(
            con,
            [firstname, lastname, birthDate, currentId],
            currentPseudo,
            pseudo
          );
          if (updateQuery.affectedRows === 1) {
            const token = jwt.sign(
              {
                id: currentId,
                role: currentRole,
                email: currentEmail,
                pseudo,
              },

              JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res
              .cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json({
                result: true,
                response: "Utilisateur modifié",
              });
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
        });
      }
    } else if (user.length === 0) {
      if (currentId == req.params.userId) {
        try {
          const updateQuery = await updateUser(
            con,
            [pseudo, firstname, lastname, birthDate, currentId],
            currentPseudo,
            pseudo
          );
          if (updateQuery.affectedRows === 1) {
            const token = jwt.sign(
              {
                id: currentId,
                role: currentRole,
                email: currentEmail,
                pseudo,
              },

              JWT_SECRET,
              {
                expiresIn: "24h",
              }
            );
            res
              .cookie("jwt", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
              })
              .json({
                result: true,
                response: "Utilisateur modifié",
              });
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
        });
      }
    } else {
      // User already exists in database
      res.json({ result: false, error: "L'utilisateur existe déjà !" });
    }
  } catch (error) {
    console.error("Error during update:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Update a user role if user is at least "admin"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyRole = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { role, pseudo } = req.body;
  if (!checkBody(req.body, ["role", "pseudo"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }
  if (currentRole !== "admin" && role === "admin") {
    return res.status(400).json({
      result: false,
      error:
        "Vous ne possédez pas les droits de passer un utilisateur en admin.",
    });
  }
  if (currentRole === "admin" || currentRole === "gerant") {
    let con;
    try {
      con = await getConnection();
      const user = await getUserByPseudoOrEmail(con, [pseudo, pseudo]);
      if (user.length > 0) {
        try {
          const updateQuery = await updateRole(con, [role, req.params.userId]);
          if (updateQuery.affectedRows === 1) {
            if (currentId == req.params.userId) {
              const token = jwt.sign(
                {
                  id: currentId,
                  role: role,
                  email: currentEmail,
                  currentPseudo,
                },

                JWT_SECRET,
                {
                  expiresIn: "24h",
                }
              );
              res
                .cookie("jwt", token, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                  maxAge: 24 * 60 * 60 * 1000,
                })
                .json({
                  result: true,
                  response: "Utilisateur modifié",
                });
            } else {
              res.json({
                result: true,
                response: "Utilisateur modifié",
              });
            }
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        // User already exists in database
        res.json({ result: false, error: "Utilisateur introuvable !" });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    } finally {
      if (con) con.release();
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
    });
  }
};

/**
 * Update a user password if authenticated
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyPassword = async (req, res) => {
  const {
    pseudo: currentPseudo,
    email: currentEmail,
    role: currentRole,
    id: currentId,
  } = req.user;
  const { newPassword, confirmPassword, lastPassword } = req.body;
  if (
    !isValidPassword(newPassword) ||
    !isValidPassword(confirmPassword) ||
    !isValidPassword(lastPassword)
  ) {
    return res.status(500).json({
      result: false,
      error:
      `Veuillez écrire un mot de passe qui correspond à une de ces conditions :
      - 12 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial.
      - 14 caractères, 1 majuscule, 1 minuscule, 1 chiffre.
      - 7 mots séparés par un espace.`,
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(500).json({
      result: false,
      error:
        "Le nouveau mot de passe ainsi que sa confirmation doivent être les mêmes !",
    });
  }

  if (newPassword === lastPassword && confirmPassword === lastPassword) {
    return res.status(500).json({
      result: false,
      error: "Veuillez entrer un mot de passe différent du précédent !",
    });
  }

  if (currentId == req.params.userId) {
    let con;
    try {
      con = await getConnection();
      const user = await getUserByPseudoOrEmail(con, [
        currentPseudo,
        currentPseudo,
      ]);
      if (user.length > 0) {
        const comparePasswords = await bcrypt.compare(
          lastPassword,
          user[0].password
        );
        if (comparePasswords) {
          const hash = await bcrypt.hash(confirmPassword, 10);
          try {
            const updateQuery = await updatePassword(con, [
              hash,
              req.params.userId,
            ]);
            if (updateQuery.affectedRows === 1) {
              res.json({
                result: true,
                response: "Utilisateur modifié",
              });
            }
          } catch (error) {
            console.error("Error during update:", error);
            res
              .status(500)
              .json({ result: false, error: "Internal server error." });
          }
        } else {
          res.json({ result: false, error: "Mot de passe erroné" });
        }
      } else {
        // User already exists in database
        res.json({ result: false, error: "Utilisateur introuvable !" });
      }
    } catch (error) {
      console.error("Error during update:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    } finally {
      if (con) con.release();
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier cet utilisateur !",
    });
  }
};

/**
 * Delete a user if authenticated or delete one user if "admin"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.removeUser = async (req, res) => {
  const { id, email, role } = req.user;

  let con;
  try {
    con = await getConnection();
    const user = await getUserByPseudoOrEmail(con, [email, email]);

    if (user.length > 0) {
      const userRes = user[0];
      if (role == "admin" || id == userRes.id) {
        try {
          const deleteQuery = await deleteUser(con, req.params.userId);
          if (deleteQuery.affectedRows === 1) {
            if (id === req.params.userId) {
              res
                .clearCookie("jwt")
                .json({
                  result: true,
                  response: "Utilisateur supprimé",
                })
                .end();
            } else {
              res
                .json({
                  result: true,
                  response: "Utilisateur supprimé",
                })
                .end();
            }
          }
        } catch (error) {
          console.error("Error during delete:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Vous n'avez pas les droits pour supprimer cet utilisateur !",
        });
      }
    } else {
      res.json({ result: false, error: "Utilisateur introuvable !" });
    }
  } catch (error) {
    console.error("Error during delete:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  } finally {
    if (con) con.release();
  }
};

/**
 * logout user authentication
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 */
exports.logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
  res.end();
};
