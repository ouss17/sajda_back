const { checkBody } = require("../modules/checkBody");
const { getConnection } = require("../models/connection_mysql");
const {
  createFeedback,
  updateFeedback,
  getOneFeedback,
  deleteFeedback,
  getAllFeedbacksByMosquee,
  getAllFeedbacksByUser,
  getAllFeedbacksByTarget,
} = require("../modules/queries/feedbacks_query");

/**
 * Create a feedback if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addFeedback = async (req, res) => {
  let { title, detail, target } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["title", "detail", "target"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role !== null && role !== undefined && role !== "") {
    let con;
    try {
      con = await getConnection();
      const feedback = await createFeedback(con, [
        title,
        detail,
        target,
        1,
        id,
      ]);
      if (feedback.affectedRows === 1) {
        res.json({
          result: true,
          response: "Feedback créé",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    } finally {
      if (con) con.release();
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
exports.retrieveOneFeedback = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const feedback = await getOneFeedback(con, [req.params.feedbackId]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback[0],
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Get all feedback by mosquee if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.retrieveFeedbacksByMosquee = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const feedback = await getAllFeedbacksByMosquee(con, [
      req.params.mosqueeId,
    ]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  } finally {
    if (con) con.release();
  }
};

exports.retrieveFeedbacksByTarget = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const feedback = await getAllFeedbacksByTarget(con, [req.params.mosqueeId, req.params.target]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Get a feedback by user if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.retrieveFeedbacksByUser = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const feedback = await getAllFeedbacksByUser(con, [req.params.userId]);
    if (feedback) {
      res.json({
        result: true,
        data: feedback,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  } finally {
    if (con) con.release();
  }
};

/**
 * Udate a feedback if user is authentified
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyFeedback = async (req, res) => {
  let { checked, responded } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["checked", "responded"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant" || role === "imam") {
    let con;
    try {
      con = await getConnection();
      const isExists = await getOneFeedback(con, [req.params.feedbackId]);
      if (isExists.length > 0) {
        try {
          const feedback = await updateFeedback(con, [
            checked,
            responded,
            req.params.feedbackId,
          ]);
          if (feedback.affectedRows === 1) {
            res.json({
              result: true,
              response: "Feedback modifié",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Ce Feedback n'existe pas",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    } finally {
      if (con) con.release();
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
exports.removeFeedback = async (req, res) => {
  let { role } = req.user;

  if (role === "admin" || role === "gerant") {
    let con;
    try {
      con = await getConnection();
      const isExists = await getOneFeedback(con, [req.params.feedbackId]);
      if (isExists.length > 0) {
        try {
          const feedback = await deleteFeedback(con, [req.params.feedbackId]);
          if (feedback.affectedRows === 1) {
            res.json({
              result: true,
              response: "Feedback supprimé",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Ce feedback n'existe pas",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    } finally {
      if (con) con.release();
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un feedback !",
    });
  }
};
