const createMosqueeConfig = async (con, values) => {
  let query = `
  INSERT INTO mosquee_config 
  (iqama_fajr, iqama_dhor, iqama_asr, iqama_maghrib, iqama_isha, nb_jumuas, jumuas, color, id_mosquee) 
  VALUES (?);
  `;

  // Executing the query
  try {
    const rows = await con.query(query, [values]);
    console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getOneMosqueeConfigByMosquee = async (con, values) => {
  let query = `
  SELECT *
  FROM mosquee_config
  WHERE id_mosquee = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateMosqueeConfig = async (con, values) => {
  let query = `
  UPDATE mosquee_config 
  SET iqama_fajr = ?, iqama_dhor = ?, iqama_asr = ?, iqama_maghrib = ?, iqama_isha = ?, nb_jumuas = ?, jumuas = ?, color = ?
  WHERE id_mosquee = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

module.exports = {
  createMosqueeConfig,
  getOneMosqueeConfigByMosquee,
  updateMosqueeConfig,
};
