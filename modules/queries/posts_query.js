const createPost = async (con, values) => {
  let query = `
  INSERT INTO posts 
  (title, content, media, id_mosquee, id_category, id_user) 
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

const getAllPosts = async (con, values) => {
  let query = `
  SELECT *
  FROM posts
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

const getOnePost = async (con, values) => {
  let query = `
  SELECT *
  FROM posts
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

const getAllPostsByMosquee = async (con, values) => {
  let query = `
  SELECT *
  FROM posts
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

const getAllPostsAvailable = async (con, values) => {
  let query = `
  SELECT *
  FROM posts
  WHERE active = 1
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

const getAllPostsByCategorie = async (con, values) => {
  let query = `
  SELECT *
  FROM posts
  WHERE id_category = ? AND id_mosquee = ? AND active = 1
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

const updatePost = async (con, values) => {
  let query = `
  UPDATE posts 
  SET  title = ?, content = ?, media = ?, updated_at = ?, active = ?, id_category = ?, id_user = ?
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

const deletePost = async (con, values) => {
  let query = `
  DELETE
  FROM posts 
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
  createPost,
  getOnePost,
  getAllPosts,
  updatePost,
  deletePost,
  getAllPostsByMosquee,
  getAllPostsAvailable,
  getAllPostsByCategorie,
};
