const { checkBody } = require("../modules/checkBody");
const {
  addFeedback,
  getOneFeedback,
  getFeedbacksByMosquee,
  getFeedbacksByTarget,
  getFeedbacksByUser,
  updateFeedback,
  deleteFeedback,
} = require("../services/feedbacksService");

exports.addFeedback = async (req, res) => {
  const { title, detail, target } = req.body;
  const { id: userId, role } = req.user;

  if (!role) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer un feedback !",
    });
  }

  try {
    const feedback = await addFeedback({
      title,
      detail,
      target,
      id_mosquee: 1, // Default mosquee ID
      id_user: userId,
    });
    res.json({ result: true, response: "Feedback créé", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

exports.retrieveOneFeedback = async (req, res) => {
  try {
    const feedback = await getOneFeedback(req.params.feedbackId);
    res.json({ result: true, data: feedback });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.retrieveFeedbacksByMosquee = async (req, res) => {
  try {
    const feedbacks = await getFeedbacksByMosquee(req.params.mosqueeId);
    res.json({ result: true, data: feedbacks });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

exports.retrieveFeedbacksByTarget = async (req, res) => {
  try {
    const feedbacks = await getFeedbacksByTarget(
      req.params.mosqueeId,
      req.params.target
    );
    res.json({ result: true, data: feedbacks });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

exports.retrieveFeedbacksByUser = async (req, res) => {
  try {
    const feedbacks = await getFeedbacksByUser(req.params.userId);
    res.json({ result: true, data: feedbacks });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: error.message });
  }
};

exports.modifyFeedback = async (req, res) => {
  const { checked, responded } = req.body;
  const { role } = req.user;

  if (!["admin", "gerant", "imam"].includes(role)) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un feedback !",
    });
  }

  try {
    const feedback = await updateFeedback(req.params.feedbackId, {
      checked,
      responded,
    });
    res.json({ result: true, response: "Feedback modifié", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.removeFeedback = async (req, res) => {
  const { role } = req.user;

  if (!["admin", "gerant"].includes(role)) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un feedback !",
    });
  }

  try {
    const feedback = await deleteFeedback(req.params.feedbackId);
    res.json({ result: true, response: "Feedback supprimé", data: feedback });
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};
