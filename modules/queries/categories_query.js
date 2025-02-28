/**
 * Create a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @see addCategory
 */
const createCategory = async (con, values) => {
  let query = `
  INSERT INTO categories 
  (name, comment, url_name) 
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

/**
 * Get all categories in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @see retrieveCategories
 */
const getAllCategories = async (con, values) => {
  let query = `
  SELECT *
  FROM categories;
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

/**
 * Get one category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 * @author Ousmane
 */
const getOneCategory = async (con, values) => {
  let query = `
  SELECT *
  FROM categories
  WHERE url_name = ?;
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

/**
 * Update a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 */
const updateCategory = async (con, values) => {
  let query = `
  UPDATE categories 
  SET  name = ?, comment = ?, url_name = ?
  WHERE url_name = ?;
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

/**
 * Remove a category in database
 * @param {Object} con Database connection object
 * @param {Array} values Array of values
 * @returns object of query
 */
const deleteCategory = async (con, values) => {
  let query = `
  DELETE
  FROM categories 
  WHERE url_name = ?;
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
  createCategory,
  getAllCategories,
  getOneCategory,
  updateCategory,
  deleteCategory,
};
