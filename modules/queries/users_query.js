const createUser = async (con, values) => {
  let query = `
  INSERT INTO users 
  (pseudo, email, password, firstname, lastname, birthDate, external_id) 
  VALUES (?);
  `;

  // Executing the query
  try {
    const rows = await con.query(query, [values]);
    // // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getUserByPseudoOrEmail = async (con, values) => {
  let query = `
  SELECT *
  FROM users 
  WHERE email = ? OR pseudo = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    console.log(rows[0]);
    
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const getUsers = async (con, values) => {
  let query = `
  SELECT *
  FROM users 
  WHERE role != 'admin';
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const deleteUser = async (con, values) => {
  let query = `
  DELETE
  FROM users 
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateUser = async (con, values, currentPseudo, pseudo) => {
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
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateRole = async (con, values) => {
  let query = `
  UPDATE users 
  SET role = ?
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updatePassword = async (con, values) => {
  let query = `
  UPDATE users 
  SET password = ?
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
};

const updateExternal = async (con, values) => {
  let query = `
  UPDATE users 
  SET external_id = ?
  WHERE id = ?;
  `;

  // Executing the query
  try {
    const rows = await con.query(query, values);
    // console.log("Query success, rows:", rows?.length);
    return rows[0];
  } catch (err) {
    console.error("Query error:", err);
    throw err;
  }
}

module.exports = {
  createUser,
  getUserByPseudoOrEmail,
  deleteUser,
  updateUser,
  updateRole,
  updatePassword,
  getUsers,
  updateExternal
};
