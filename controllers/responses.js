const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection_mysql");
const {
  createResponseFeedback,
  updateResponseFeedback,
  getOneResponseFeedback,
  deleteResponseFeedback,
  getAllResponseFeedbacksByUser,
} = require("../modules/queries/responses_query");

/**
 * Create a feedback if user is authentified and at least imam
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addResponse = async (req, res) => {
  let { response, idFeedback, idUserWhoAsk } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["response", "idFeedback", "idUserWhoAsk"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role == "admin" || role == "gerant" || role == "imam") {
    try {
      const feedback = await createResponseFeedback(con, [
        response,
        idFeedback,
        idUserWhoAsk,
        id,
      ]);
      if (feedback.affectedRows === 1) {
        res.json({
          result: true,
          response: "Feedback créé",
        });
      }
    } catch (error) {
      console.error("Error during create:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer un feedback !",
    });
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
    const feedback = await getOneResponseFeedback(con, [req.params.responseId]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback[0],
      });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
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
    const feedback = await getAllResponseFeedbacksByUser(con, [
      req.params.userId,
    ]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback,
      });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
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
  let { response } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["response"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant" || role === "imam") {
    try {
      const isExists = await getOneResponseFeedback(con, [
        req.params.responseId,
      ]);
      if (isExists.length > 0) {
        try {
          const feedback = await updateResponseFeedback(con, [
            response,
            req.params.responseId,
          ]);
          if (feedback.affectedRows === 1) {
            res.json({
              result: true,
              response: "Feedback modifié",
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
          error: "Ce Feedback n'existe pas",
        });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un feedback !",
    });
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
  let { role } = req.user;

  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOneResponseFeedback(con, [
        req.params.responseId,
      ]);
      if (isExists.length > 0) {
        try {
          const feedback = await deleteResponseFeedback(con, [
            req.params.responseId,
          ]);
          if (feedback.affectedRows === 1) {
            res.json({
              result: true,
              response: "Feedback supprimé",
            });
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
          error: "Ce feedback n'existe pas",
        });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un feedback !",
    });
  }
};
