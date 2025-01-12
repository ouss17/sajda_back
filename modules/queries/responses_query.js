const createResponseFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO responses_feedback 
    (response, id_feedback, id_user_who_ask, id_user) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOneResponseFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM responses_feedback
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllResponseFeedbacksByFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM responses_feedback
    WHERE id_feedback = ?
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllResponseFeedbacksByUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM responses_feedback
    WHERE id_user = ?
    ORDER BY created_at ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllResponseFeedbacksByUserAsk = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM responses_feedback
    WHERE id_user_who_ask = ?
    ORDER BY created_at ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateResponseFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE responses_feedback 
    SET  response = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteResponseFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM responses_feedback 
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
  createResponseFeedback,
  getOneResponseFeedback,
  getAllResponseFeedbacksByUserAsk,
  updateResponseFeedback,
  deleteResponseFeedback,
  getAllResponseFeedbacksByFeedback,
  getAllResponseFeedbacksByUser,
};
