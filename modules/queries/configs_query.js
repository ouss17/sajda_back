const createMosqueeConfig = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO mosquee_config 
    (iqama_fajr, iqama_dhor, iqama_asr, iqama_maghrib, iqama_isha, nb_jumuas, jumuas, color, id_mosquee) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOneMosqueeConfigByMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM mosquee_config
    WHERE id_mosquee = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateMosqueeConfig = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE mosquee_config 
    SET iqama_fajr = ?, iqama_dhor = ?, iqama_asr = ?, iqama_maghrib = ?, iqama_isha = ?, nb_jumuas = ?, jumuas = ?, color = ?, id_mosquee = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  createMosqueeConfig,
  getOneMosqueeConfigByMosquee,
  updateMosqueeConfig,
};
