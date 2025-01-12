/**
 * Create a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @see addCategory
 */
const createCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO categories 
    (name, comment, url_name) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

/**
 * Get all categories in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @see retrieveCategories
 */
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

/**
 * Get one category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @author Ousmane
 */
const getOneCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM categories
    WHERE url_name = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

/**
 * Update a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 */
const updateCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE categories 
    SET  name = ?, comment = ?, url_name = ?
    WHERE url_name = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

/**
 * Remove a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 */
const deleteCategory = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM categories 
    WHERE url_name = ?;
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
  getOneCategory,
  updateCategory,
  deleteCategory,
};
