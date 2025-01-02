const createFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO feedbacks 
    (title, detail, target, checked, responded, id_mosquee, id_user) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllFeedbacks = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM feedbacks
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOneFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM feedbacks
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllFeedbacksByMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM feedbacks
    WHERE id_mosquee = ?
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllFeedbacksByUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM feedbacks
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

const updateFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE feedbacks 
    SET  checked = ?, responded = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteFeedback = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM feedbacks 
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
  createFeedback,
  getOneFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getAllFeedbacksByMosquee,
  getAllFeedbacksByUser,
};
