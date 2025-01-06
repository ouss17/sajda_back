const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection_mysql");
const {
  createFeedback,
  updateFeedback,
  getOneFeedback,
  deleteFeedback,
  getAllFeedbacksByMosquee,
  getAllFeedbacksByUser,
} = require("../modules/queries/feedbacks_query");
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
    try {
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
exports.retrieveOneFeedback = async (req, res) => {
  try {
    const feedback = await getOneFeedback(con, [req.params.feedbackId]);
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
exports.retrieveFeedbacksByMosquee = async (req, res) => {
  try {
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
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};
exports.retrieveFeedbacksByUser = async (req, res) => {
  try {
    const feedback = await getAllFeedbacksByUser(con, [req.params.userId]);
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
    try {
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

exports.removeFeedback = async (req, res) => {
  let { role } = req.user;

  if (role === "admin" || role === "gerant") {
    try {
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
