const createPost = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    INSERT INTO posts 
    (title, content, media, id_mosquee, id_category, id_user) 
    VALUES (?);
    `;

    // Executing the query
    con.query(query, [values], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllPosts = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM posts
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getOnePost = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM posts
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllPostsByMosquee = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM posts
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

const getAllPostsAvailable = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM posts
    WHERE active = 1
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const getAllPostsByCategorie = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    SELECT *
    FROM posts
    WHERE id_category = ? AND id_mosquee = ? AND active = 1
    ORDER BY created_at DESC;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const updatePost = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    UPDATE posts 
    SET  title = ?, content = ?, media = ?, updated_at = ?, active = ?, id_category = ?, id_user = ?
    WHERE id = ?;
    `;

    // Executing the query
    con.query(query, values, (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });
};

const deletePost = (con, values) => {
  return new Promise((resolve, reject) => {
    let query = `
    DELETE
    FROM posts 
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
  createPost,
  getOnePost,
  getAllPosts,
  updatePost,
  deletePost,
  getAllPostsByMosquee,
  getAllPostsAvailable,
  getAllPostsByCategorie,
};
