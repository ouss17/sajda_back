const createCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO categories 
    (name, comment) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllCategories = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM categories;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updateCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE categories 
    SET  name = ?, comment = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deleteCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM categories 
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
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
