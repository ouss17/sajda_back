const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection_mysql");
const { isValidDateFormat } = require("../modules/checkFieldRegex");

/**
 * Création d'une mosquée
 * @param {Object} req
 * @param {Object} res
 * @returns {result: true||false, data:[...data]}
 */
exports.createMosquee = async (req, res) => {
  if (!checkBody(req.body, ["name", "address", "city", "zip", "country"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }
  let {
    name,
    address,
    city,
    zip,
    country,
    dateCreated,
    num,
    facebook,
    twi,
    instagram,
  } = req.body;

  //Verif date format
  if (!isValidDateFormat) {
    return res
      .status(400)
      .json({ result: false, error: "La date entrée est incorrecte." });
  }

  try {
    // Query to insert multiple rows
    let query =
      "INSERT INTO mosquees (name, address, city, zip, country, date_created, numero, facebook, x, instagram) VALUES (?);";

    // Values to be inserted
    let values = [
      name,
      address,
      city,
      zip,
      country,
      dateCreated,
      num,
      facebook,
      twi,
      instagram,
    ];

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) throw err;
      res.json({ result: true, data: req.body });
    });
  } catch (error) {
    console.error(error);
  }
};
