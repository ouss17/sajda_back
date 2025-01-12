const jwt = require("jsonwebtoken");

/**
 * Check if user is authentified
 * @param {Object} req request object
 * @param {Object} res response object
 * @param {*} next
 * Continue la fonction en cours si l'utilisateur est authentifié, sinon, retourne une erreur
 */
const auth = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ error: "Vous n'êtes pas autorisé." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = { auth };
