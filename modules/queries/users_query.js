const createUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO users 
    (pseudo, email, password, firstname, lastname, birthDate, external_id) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getUserByPseudoOrEmail = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM users 
    WHERE email = ? OR pseudo = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteUser = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM users 
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateUser = (con, values, currentPseudo, pseudo) => {
  return new Promise((resolve, reject) => {
    let query = "";
    switch (true) {
      case currentPseudo == pseudo:
        query = `
    UPDATE users 
    SET firstname = ?, lastname = ?, birthDate = ?
    WHERE id = ?;
    `;
        break;

      default:
        query = `
        UPDATE users 
        SET pseudo = ?, firstname = ?, lastname = ?, birthDate = ?
        WHERE id = ?;
        `;
        break;
    }

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateRole = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE users 
    SET role = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updatePassword = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE users 
    SET password = ?
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
  createUser,
  getUserByPseudoOrEmail,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
};
