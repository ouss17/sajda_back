const { checkBody } = require("../modules/checkBody");
const {
  addResponse,
  getOneResponse,
  getResponsesByUser,
  updateResponse,
  deleteResponse,
} = require("../services/responsesService");

/**
 * Create a feedback if user is authentified and at least imam
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addResponse = async (req, res) => {
  const { response, idFeedback, idUserWhoAsk } = req.body;
  const { id: idResponder, role } = req.user;

  // Vérification des rôles
  if (!["admin", "gerant", "imam"].includes(role)) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer un feedback !",
    });
  }

  try {
    const feedback = await addResponse({
      response,
      idFeedback,
      idUserWhoAsk,
      idResponder,
    });
    res.json({ result: true, response: "Feedback créé", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

/**
 * Get all feedback if user is authentified
 * @param {Object} req Unrequired
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.retrieveOneResponse = async (req, res) => {
  try {
    const feedback = await getOneResponse(req.params.responseId);
    res.json({ result: true, data: feedback });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};

/**
 * Get a feedback by user if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.retrieveResponsesByUser = async (req, res) => {
  try {
    const feedbacks = await getResponsesByUser(req.params.userId);
    res.json({ result: true, data: feedbacks });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

/**
 * Udate a feedback if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyResponse = async (req, res) => {
  const { response } = req.body;
  const { role } = req.user;

  // Vérification des rôles
  if (!["admin", "gerant", "imam"].includes(role)) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un feedback !",
    });
  }

  try {
    const feedback = await updateResponse(req.params.responseId, { response });
    res.json({ result: true, response: "Feedback modifié", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};

/**
 * Remove a feedback if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.removeResponse = async (req, res) => {
  const { role } = req.user;

  // Vérification des rôles
  if (!["admin", "gerant"].includes(role)) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un feedback !",
    });
  }

  try {
    const feedback = await deleteResponse(req.params.responseId);
    res.json({ result: true, response: "Feedback supprimé", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};
