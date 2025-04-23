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
const { checkBody } = require("../modules/checkBody");

exports.addFeedback = async (feedbackData) => {
  const { title, detail, target, id_mosquee, id_user } = feedbackData;

  // Vérification des champs requis
  if (!checkBody(feedbackData, ["title", "detail", "target"])) {
    throw new Error("Vous n'avez pas rempli tous les champs.");
  }

  const con = await getConnection();
  try {
    const feedback = await createFeedback(con, [
      title,
      detail,
      target,
      id_mosquee || 1, // Default mosquee ID
      id_user,
    ]);
    return feedback;
  } finally {
    if (con) con.release();
  }
};

exports.getOneFeedback = async (feedbackId) => {
  const con = await getConnection();
  try {
    const feedback = await getOneFeedback(con, feedbackId);
    if (feedback.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }
    return feedback[0];
  } finally {
    if (con) con.release();
  }
};

exports.getFeedbacksByMosquee = async (mosqueeId) => {
  const con = await getConnection();
  try {
    const feedbacks = await getAllFeedbacksByMosquee(con, mosqueeId);
    return feedbacks;
  } finally {
    if (con) con.release();
  }
};

exports.getFeedbacksByTarget = async (mosqueeId, target) => {
  const con = await getConnection();
  try {
    const feedbacks = await getAllFeedbacksByTarget(con, [mosqueeId, target]);
    return feedbacks;
  } finally {
    if (con) con.release();
  }
};

exports.getFeedbacksByUser = async (userId) => {
  const con = await getConnection();
  try {
    const feedbacks = await getAllFeedbacksByUser(con, userId);
    return feedbacks;
  } finally {
    if (con) con.release();
  }
};

exports.updateFeedback = async (feedbackId, feedbackData) => {
  const { checked, responded } = feedbackData;

  // Vérification des champs requis
  if (!checkBody(feedbackData, ["checked", "responded"])) {
    throw new Error("Vous n'avez pas rempli tous les champs.");
  }

  const con = await getConnection();
  try {
    const isExists = await getOneFeedback(con, feedbackId);
    if (isExists.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }

    const feedback = await updateFeedback(con, [checked, responded, feedbackId]);
    return feedback;
  } finally {
    if (con) con.release();
  }
};

exports.deleteFeedback = async (feedbackId) => {
  const con = await getConnection();
  try {
    const isExists = await getOneFeedback(con, feedbackId);
    if (isExists.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }

    const feedback = await deleteFeedback(con, feedbackId);
    return feedback;
  } finally {
    if (con) con.release();
  }
};