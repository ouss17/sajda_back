const createFeedback = async (con, values) => {
  let query = `
  INSERT INTO feedbacks 
  (title, detail, target, id_mosquee, id_user) 
  VALUES (?);
  `;

  // Executing the query
  try {
    const rows = await con.query(query, [values]);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getAllFeedbacks = async (con, values) => {
  let query = `
  SELECT *
  FROM feedbacks
  ORDER BY created_at DESC;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getAllFeedbacksByTarget = async (con, values) => {
  let query = `
  SELECT *
  FROM feedbacks
  WHERE id_mosquee = ? AND target = ?
  ORDER BY created_at DESC;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getOneFeedback = async (con, values) => {
  let query = `
  SELECT *
  FROM feedbacks
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getAllFeedbacksByMosquee = async (con, values) => {
  let query = `
  SELECT *
  FROM feedbacks
  WHERE id_mosquee = ?
  ORDER BY created_at DESC;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getAllFeedbacksByUser = async (con, values) => {
  let query = `
  SELECT *
  FROM feedbacks
  WHERE id_user = ?
  ORDER BY created_at ASC;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateFeedback = async (con, values) => {
  let query = `
  UPDATE feedbacks 
  SET  checked = ?, responded = ?
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const deleteFeedback = async (con, values) => {
  let query = `
  DELETE
  FROM feedbacks 
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    console.log("Query success, rows:", rows?.length);
    return rows;
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

module.exports = {
  createFeedback,
  getOneFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacksByMosquee,
  getAllFeedbacksByUser,
  getAllFeedbacksByTarget
};
