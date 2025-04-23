const { getConnection } = require("../models/connection_mysql");
const {
  createResponseFeedback,
  updateResponseFeedback,
  getOneResponseFeedback,
  deleteResponseFeedback,
  getAllResponseFeedbacksByUser,
} = require("../modules/queries/responses_query");
const { checkBody } = require("../modules/checkBody");

exports.addResponse = async (responseData) => {
  const { response, idFeedback, idUserWhoAsk, idResponder } = responseData;

  // Vérification des champs requis
  if (!checkBody(responseData, ["response", "idFeedback", "idUserWhoAsk"])) {
    throw new Error("Vous n'avez pas rempli tous les champs.");
  }

  const con = await getConnection();
  try {
    const feedback = await createResponseFeedback(con, [
      response,
      idFeedback,
      idUserWhoAsk,
      idResponder,
    ]);
    return feedback;
  } finally {
    if (con) con.release();
  }
};

exports.getOneResponse = async (responseId) => {
  const con = await getConnection();
  try {
    const feedback = await getOneResponseFeedback(con, responseId);
    if (feedback.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }
    return feedback[0];
  } finally {
    if (con) con.release();
  }
};

exports.getResponsesByUser = async (userId) => {
  const con = await getConnection();
  try {
    const feedbacks = await getAllResponseFeedbacksByUser(con, userId);
    return feedbacks;
  } finally {
    if (con) con.release();
  }
};

exports.updateResponse = async (responseId, responseData) => {
  const { response } = responseData;

  // Vérification des champs requis
  if (!checkBody(responseData, ["response"])) {
    throw new Error("Vous n'avez pas rempli tous les champs.");
  }

  const con = await getConnection();
  try {
    const isExists = await getOneResponseFeedback(con, responseId);
    if (isExists.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }

    const feedback = await updateResponseFeedback(con, [response, responseId]);
    return feedback;
  } finally {
    if (con) con.release();
  }
};

exports.deleteResponse = async (responseId) => {
  const con = await getConnection();
  try {
    const isExists = await getOneResponseFeedback(con, responseId);
    if (isExists.length === 0) {
      throw new Error("Ce feedback n'existe pas.");
    }

    const feedback = await deleteResponseFeedback(con, responseId);
    return feedback;
  } finally {
    if (con) con.release();
  }
};