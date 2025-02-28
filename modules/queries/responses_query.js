const createResponseFeedback = async (con, values) => {
  let query = `
  INSERT INTO responses_feedback 
  (response, id_feedback, id_user_who_ask, id_user) 
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

const getOneResponseFeedback = async (con, values) => {
  let query = `
  SELECT *
  FROM responses_feedback
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

const getAllResponseFeedbacksByFeedback = async (con, values) => {
  let query = `
  SELECT *
  FROM responses_feedback
  WHERE id_feedback = ?
  ORDER BY created_at DESC;
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

const getAllResponseFeedbacksByUser = async (con, values) => {
  let query = `
  SELECT *
  FROM responses_feedback
  WHERE id_user = ?
  ORDER BY created_at ASC;
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

const getAllResponseFeedbacksByUserAsk = async (con, values) => {
  let query = `
  SELECT *
  FROM responses_feedback
  WHERE id_user_who_ask = ?
  ORDER BY created_at ASC;
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

const updateResponseFeedback = async (con, values) => {
  let query = `
  UPDATE responses_feedback 
  SET  response = ?
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

const deleteResponseFeedback = async (con, values) => {
  let query = `
  DELETE
  FROM responses_feedback 
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
  createResponseFeedback,
  getOneResponseFeedback,
  getAllResponseFeedbacksByUserAsk,
  updateResponseFeedback,
  deleteResponseFeedback,
  getAllResponseFeedbacksByFeedback,
  getAllResponseFeedbacksByUser,
};
