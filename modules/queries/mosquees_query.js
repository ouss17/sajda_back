const createMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO mosquees 
    (name, address, city, zip, country, date_created, numero, facebook, x, instagram, isAvailable) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllMosquees = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM mosquees
    ORDER BY name ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOneMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM mosquees
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllAvailableMosquees = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM mosquees
    WHERE isAvailable = 1
    ORDER BY name ASC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE mosquees 
    SET name = ?, address = ?, city = ?, zip = ?, country = ?, date_created = ?, numero = ?, facebook = ?, x = ?, instagram = ?, isAvailable = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM mosquees 
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
  createMosquee,
  getOneMosquee,
  getAllMosquees,
  updateMosquee,
  deleteMosquee,
  getAllAvailableMosquees,
};
