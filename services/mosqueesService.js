const { getConnection } = require("../models/connection_mysql");
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
const fs = require("fs");
const path = require("path");
const readline = require("readline");

exports.addMosquee = async (mosqueeData, configData) => {
  const {
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
  } = mosqueeData;

  const con = await getConnection();
  try {
    // Vérifie si la mosquée existe déjà
    const isExists = await getOneMosqueeByLocation(con, [
      name,
      address,
      city,
      zip,
      country,
    ]);
    if (isExists.length > 0) {
      throw new Error("Cette mosquée existe déjà !");
    }

    // Crée la mosquée
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

    // Crée la configuration associée
    const config = await createMosqueeConfig(con, [
      configData.iqama_fajr,
      configData.iqama_dhor,
      configData.iqama_asr,
      configData.iqama_maghrib,
      configData.iqama_isha,
      configData.nb_jumuas,
      configData.jumuas,
      configData.color,
      mosquee.insertId,
    ]);

    return { mosquee, config };
  } finally {
    if (con) con.release();
  }
};

exports.getMosquee = async (mosqueeId) => {
  const con = await getConnection();
  try {
    const mosquee = await getOneMosquee(con, mosqueeId);
    if (mosquee.length === 0) {
      throw new Error("Cette mosquée n'existe pas !");
    }
    return mosquee[0];
  } finally {
    if (con) con.release();
  }
};

exports.getAllAvailableMosquees = async () => {
  const con = await getConnection();
  try {
    const mosquees = await getAllAvailableMosquees(con);
    return mosquees;
  } finally {
    if (con) con.release();
  }
};

exports.updateMosquee = async (mosqueeId, mosqueeData, configData) => {
  const {
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
  } = mosqueeData;

  const con = await getConnection();
  try {
    console.log("MOSQUEE ID", mosqueeId);

    const mosqueeToUpdate = await getOneMosquee(con, mosqueeId);
    if (mosqueeToUpdate.length === 0) {
      throw new Error("Cette mosquée n'existe pas !");
    }

    // Vérifie si une autre mosquée avec le même nom et la même ville existe
    const existingMosquee = await getOneMosqueeByLocation(con, [
      name,
      address,
      city,
      zip,
      country,
    ]);
    console.log("EXISTING MOSQUEE", existingMosquee);
    
    if (
      existingMosquee.length > 0 &&
      existingMosquee[0].id !== mosqueeId && existingMosquee[0].name === name
      && existingMosquee[0].city === city
    ) {
      throw new Error(
        "Une mosquée portant le même nom et dans cette ville existe déjà !"
      );
    }

    // Met à jour la mosquée
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
      mosqueeId,
    ]);

    // Met à jour la configuration associée
    const config = await updateMosqueeConfig(con, [
      configData.iqama_fajr,
      configData.iqama_dhor,
      configData.iqama_asr,
      configData.iqama_maghrib,
      configData.iqama_isha,
      configData.nb_jumuas,
      configData.jumuas,
      configData.color,
      mosqueeId,
    ]);

    return { mosquee, config };
  } finally {
    if (con) con.release();
  }
};

exports.deleteMosquee = async (mosqueeId) => {
  const con = await getConnection();
  try {
    // Vérifie si la mosquée existe
    const isExists = await getOneMosquee(con, mosqueeId);
    if (isExists.length === 0) {
      throw new Error("Cette mosquée n'existe pas !");
    }

    // Supprime la mosquée
    const result = await deleteMosquee(con, mosqueeId);
    return result;
  } finally {
    if (con) con.release();
  }
};

exports.getMosqueeCsv = async (mosqueeId, year) => {
  const src = path.resolve(
    __dirname,
    `../ressources/csv/${mosqueeId}/${year}.csv`
  );
  const horaires = {};

  try {
    if (!fs.existsSync(src)) {
      throw new Error("Fichier non trouvé");
    }

    const readStream = fs.createReadStream(src);
    const rl = readline.createInterface({ input: readStream });

    return new Promise((resolve, reject) => {
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

      rl.on("close", () => resolve(horaires));
      rl.on("error", (err) => reject(err));
    });
  } catch (error) {
    throw new Error(error.message);
  }
};