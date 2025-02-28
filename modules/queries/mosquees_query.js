const createMosquee = async (con, values) => {
  let query = `
  INSERT INTO mosquees 
  (name, address, city, zip, country, date_created, numero, facebook, x, instagram) 
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

const getAllMosquees = async (con, values) => {
  let query = `
  SELECT *
  FROM mosquees
  ORDER BY name ASC;
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

const getOneMosquee = async (con, values) => {
  let query = `
  SELECT *
  FROM mosquees
  INNER JOIN mosquee_config ON mosquees.id = mosquee_config.id_mosquee
  WHERE mosquees.id = ?;
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

const getOneMosqueeByLocation = async (con, values) => {
  let query = `
  SELECT *
  FROM mosquees
  WHERE name = ? AND address = ? AND city = ? AND zip = ? AND country = ?;
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

const getAllAvailableMosquees = async (con, values) => {
  let query = `
  SELECT *
  FROM mosquees
  INNER JOIN mosquee_config ON mosquees.id = mosquee_config.id_mosquee
  WHERE mosquees.isAvailable = 1
  ORDER BY name ASC;
  `;

  // Executing the query
  try {
    const rows = await con.query(query);
    console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateMosquee = async (con, values) => {
  let query = `
  UPDATE mosquees 
  SET name = ?, address = ?, city = ?, zip = ?, country = ?, date_created = ?, numero = ?, facebook = ?, x = ?, instagram = ?, isAvailable = ?
  WHERE id = ?;
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

const deleteMosquee = async (con, values) => {
  let query = `
  DELETE
  FROM mosquees 
  WHERE id = ?;
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
  createMosquee,
  getOneMosquee,
  getAllMosquees,
  updateMosquee,
  deleteMosquee,
  getAllAvailableMosquees,
  getOneMosqueeByLocation,
};
