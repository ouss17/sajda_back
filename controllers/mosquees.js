const fs = require("fs");
const path = require("path");
const readline = require("readline");

const { checkBody } = require("../modules/checkBody");
const { getConnection } = require('../models/connection_mysql');
const { isValidDateFormat } = require("../modules/checkFieldRegex");
const {
  getOneMosqueeByLocation,
  createMosquee,
  getOneMosquee,
  getAllAvailableMosquees,
  updateMosquee,
  deleteMosquee,
} = require("../modules/queries/mosquees_query");
const {
  createMosqueeConfig,
  updateMosqueeConfig,
} = require("../modules/queries/configs_query");

/**
 * Create a mosquee if user is "admin"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addMosquee = async (req, res) => {
  let {
    name,
    address,
    city,
    zip,
    country,
    dateCreated,
    num,
    facebook,
    x,
    instagram,
  } = req.body;

  let {
    iqama_fajr,
    iqama_dhor,
    iqama_asr,
    iqama_maghrib,
    iqama_isha,
    nb_jumuas,
    jumuas,
    color,
  } = req.body;

  const { id, role, pseudo, email } = req.user;

  if (!checkBody(req.body, ["name", "address", "city", "zip", "country"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (dateCreated !== "" && dateCreated !== null && dateCreated !== undefined) {
    //Verif date format
    if (!isValidDateFormat(dateCreated)) {
      return res
        .status(400)
        .json({ result: false, error: "La date entrée est incorrecte." });
    }
  }

  if (role === "admin") {
  let con;
    try {
      con = await getConnection();
      const isExists = await getOneMosqueeByLocation(con, [
        name,
        address,
        city,
        zip,
        country,
      ]);
      if (isExists.length === 0) {
        try {
          const mosquee = await createMosquee(con, [
            name,
            address,
            city,
            zip,
            country,
            dateCreated,
            num,
            facebook,
            x,
            instagram,
          ]);
          if (mosquee.affectedRows === 1) {
            console.log(mosquee);
            try {
              const config = await createMosqueeConfig(con, [
                iqama_fajr,
                iqama_dhor,
                iqama_asr,
                iqama_maghrib,
                iqama_isha,
                nb_jumuas,
                jumuas,
                color,
                mosquee.insertId,
              ]);
              if (config.affectedRows === 1) {
                res.json({
                  result: true,
                  response: "Mosquée créée",
                });
              }
            } catch (error) {
              console.error("Erreur lors de la création de la configuration :", error);
              res
                .status(500)
                .json({ result: false, error: "Erreur interne du serveur." });
            }
          }
        } catch (error) {
          console.error("Erreur lors de la création de la mosquée :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }finally {
          if (con) {
            con.release();
            console.log("Connection released");
          }
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Cette mosquée existe déjà !",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer une mosquée !",
    });
  }
};

/**
 * Get a mosquee
 * @param {Object} req Unrequired
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrieveMosquee = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const mosquee = await getOneMosquee(con, req.params.mosqueeId);
    if (mosquee.length > 0) {
      res.json({
        result: true,
        data: mosquee[0],
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }finally {
    if (con) {
      con.release();
      console.log("Connection released");
    }
  }
};

/**
 * Get all mosquee available
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrieveAllAvailableMosquee = async (req, res) => {
  let con;
  try {
    con = await getConnection();
    const mosquees = await getAllAvailableMosquees(con);
    if (mosquees.length > 0) {
      res.json({
        result: true,
        data: mosquees,
      });
    }else{
      res.json({
        result: true,
        data: [],
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur.", message : error });
  }finally {
    if (con) {
      con.release();
      console.log("Connection released");
    }
  }
};

/**
 * Update a mosquee if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyMosquee = async (req, res) => {
  let {
    name,
    address,
    city,
    zip,
    country,
    dateCreated,
    num,
    facebook,
    x,
    instagram,
    isAvailable,
  } = req.body;

  let {
    iqama_fajr,
    iqama_dhor,
    iqama_asr,
    iqama_maghrib,
    iqama_isha,
    nb_jumuas,
    jumuas,
    color,
  } = req.body;

  const { id, role, pseudo, email } = req.user;

  if (!checkBody(req.body, ["name", "address", "city", "zip", "country"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (dateCreated !== "" && dateCreated !== null && dateCreated !== undefined) {
    //Verif date format
    if (!isValidDateFormat(dateCreated)) {
      return res
        .status(400)
        .json({ result: false, error: "La date entrée est incorrecte." });
    }
  }

  if (role === "admin" || role === "gerant") {
    let con;
    try {
      con = await getConnection();
      const isExists = await getOneMosqueeByLocation(con, [
        name,
        address,
        city,
        zip,
        country,
      ]);

      if (
        isExists.length === 0 ||
        (isExists.length > 0 && isExists[0].id == req.params.mosqueeId)
      ) {
        try {
          const mosquee = await updateMosquee(con, [
            name,
            address,
            city,
            zip,
            country,
            dateCreated,
            num,
            facebook,
            x,
            instagram,
            isAvailable,
            req.params.mosqueeId,
          ]);
          if (mosquee.affectedRows === 1) {
            try {
              const config = await updateMosqueeConfig(con, [
                iqama_fajr,
                iqama_dhor,
                iqama_asr,
                iqama_maghrib,
                iqama_isha,
                nb_jumuas,
                jumuas,
                color,
                req.params.mosqueeId,
              ]);

              if (config.affectedRows === 1) {
                res.json({
                  result: true,
                  response: "Mosquée modifiée",
                });
              }
            } catch (error) {
              console.error("Erreur lors de la mise à jour de la configuration :", error);
              res
                .status(500)
                .json({ result: false, error: "Erreur interne du serveur." });
            }
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la mosquée :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }
      } else {
        res.status(400).json({
          result: false,
          error:
            "Une mosquée portant le même nom et dans cette ville existe déjà !",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }finally {
      if (con) {
        con.release();
        console.log("Connection released");
      }
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier une mosquée !",
    });
  }
};

/**
 * Remove a mosquee if user is "admin"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.removeMosquee = async (req, res) => {
  const { id, role } = req.user;
  if (role == "admin") {
    let con;
    try {
      con = await getConnection();
      const isExists = await getOneMosquee(con, req.params.mosqueeId);
      if (isExists.length > 0) {
        try {
          const mosquee = await deleteMosquee(con, req.params.mosqueeId);
          if (mosquee.affectedRows === 1) {
            res.json({
              result: true,
              response: "Mosquée supprimée",
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
          error: "Cette mosquée n'existe pas !",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }finally {
      if (con) {
        con.release();
        console.log("Connection released");
      }
    }
  } else {
    res.status(400).json({
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

  const src = path.resolve(
    __dirname,
    `../ressources/csv/${mosqueeId}/${year}.csv`
  );
  const horaires = {};

  try {
    if (!fs.existsSync(src)) {
      return res.status(404).json({ result: false, error: "Fichier non trouvé" });
    }

    const readStream = fs.createReadStream(src);
    const rl = readline.createInterface({ input: readStream });

    rl.on("line", (line) => {
      const columns = line.split(";");

      if (columns.length > 1) {
        const date = columns[0].trim();
        const dateRegex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

        if (dateRegex.test(date)) {
          horaires[date] = columns
            .slice(1, 7)
            .map((time) => time.trim())
            .filter((time) => time);
        }
      }
    });

    rl.on("close", () => {
      res.json({ result: true, data: horaires });
    });

    rl.on("error", (err) => {
      res.status(500).json({ result: false, error: err.message });
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
};
