const fs = require("fs");
const path = require("path");
const readline = require("readline");

const {
  addMosquee,
  getMosquee,
  getAllAvailableMosquees,
  updateMosquee,
  deleteMosquee,
  getMosqueeCsv,
} = require("../services/mosqueesService");
const { checkBody } = require("../modules/checkBody");
const { isValidDateFormat } = require("../modules/checkFieldRegex");

exports.addMosquee = async (req, res) => {
  const { role } = req.user;

  if (!checkBody(req.body, ["name", "address", "city", "zip", "country"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (req.body.dateCreated && !isValidDateFormat(req.body.dateCreated)) {
    return res
      .status(400)
      .json({ result: false, error: "La date entrée est incorrecte." });
  }

  if (role === "admin") {
    try {
      const result = await addMosquee(req.body, req.body);
      res.json({ result: true, response: "Mosquée créée", data: result });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer une mosquée !",
    });
  }
};

exports.retrieveMosquee = async (req, res) => {
  try {
    const mosquee = await getMosquee(req.params.mosqueeId);
    res.json({ result: true, data: mosquee });
  } catch (error) {
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.retrieveAllAvailableMosquee = async (req, res) => {
  try {
    const mosquees = await getAllAvailableMosquees();
    res.json({ result: true, data: mosquees });
  } catch (error) {
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.modifyMosquee = async (req, res) => {
  const { role } = req.user;

  if (!checkBody(req.body, ["name", "address", "city", "zip", "country"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (req.body.dateCreated && !isValidDateFormat(req.body.dateCreated)) {
    return res
      .status(400)
      .json({ result: false, error: "La date entrée est incorrecte." });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const result = await updateMosquee(req.params.mosqueeId, req.body, req.body);
      res.json({ result: true, response: "Mosquée modifiée", data: result });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier une mosquée !",
    });
  }
};

exports.removeMosquee = async (req, res) => {
  const { role } = req.user;

  if (role === "admin") {
    try {
      const result = await deleteMosquee(req.params.mosqueeId);
      res.json({ result: true, response: "Mosquée supprimée", data: result });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer une mosquée !",
    });
  }
};

/**
 * Get a mosquee time file
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 */
exports.retrieveCsv = async (req, res) => {
  const mosqueeId = req.params.mosqueeId;
  const year = req.params.year;

  try {
    const horaires = await getMosqueeCsv(mosqueeId, year);
    res.json({ result: true, data: horaires });
  } catch (error) {
    if (error.message === "Fichier non trouvé") {
      res.status(404).json({ result: false, error: error.message });
    } else {
      res.status(500).json({ result: false, error: error.message });
    }
  }
};
