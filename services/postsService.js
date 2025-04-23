const { getConnection } = require("../models/connection_mysql");
const {
  createPost,
  getAllPostsByMosquee,
  getOnePost,
  getAllPostsByCategorie,
  updatePost,
  deletePost,
  getAllPostsAvailable,
} = require("../modules/queries/posts_query");
const { checkBody } = require("../modules/checkBody");

exports.addPost = async (postData) => {
  const { title, content, media, id_mosquee, id_category, id_user } = postData;

  // Vérification des champs requis
  if (!checkBody(postData, ["title", "content", "id_category"])) {
    throw new Error("Champs manquants ou vides.");
  }

  const con = await getConnection();
  try {
    const post = await createPost(con, [
      title,
      content,
      media,
      id_mosquee || 1, // Default mosquee ID if not fourni
      id_category,
      id_user,
    ]);
    return post;
  } finally {
    if (con) con.release();
  }
};

exports.getPostsByMosquee = async (mosqueeId) => {
  const con = await getConnection();
  try {
    const posts = await getAllPostsByMosquee(con, mosqueeId);
    return posts;
  } finally {
    if (con) con.release();
  }
};

exports.getOnePost = async (postId) => {
  const con = await getConnection();
  try {
    const post = await getOnePost(con, postId);
    if (post.length === 0) {
      throw new Error("Ce post n'existe pas.");
    }
    return post[0];
  } finally {
    if (con) con.release();
  }
};

exports.getPostsByCategory = async (categoryId, mosqueeId) => {
  const con = await getConnection();
  try {
    const posts = await getAllPostsByCategorie(con, [categoryId, mosqueeId]);
    return posts;
  } finally {
    if (con) con.release();
  }
};

exports.getPostsAvailable = async () => {
  const con = await getConnection();
  try {
    const posts = await getAllPostsAvailable(con);
    return posts;
  } finally {
    if (con) con.release();
  }
};

exports.updatePost = async (postId, postData) => {
  const { title, content, media, id_category, active, id_user } = postData;

  // Vérification des champs requis
  if (!checkBody(postData, ["title", "content", "id_category", "active"])) {
    throw new Error("Champs manquants ou vides.");
  }

  const con = await getConnection();
  try {
    const isExists = await getOnePost(con, postId);
    if (isExists.length === 0) {
      throw new Error("Ce post n'existe pas.");
    }

    // Génération de la date au format MySQL
    const now = new Date();
    const updated_at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const post = await updatePost(con, [
      title,
      content,
      media,
      updated_at,
      active,
      id_category,
      id_user,
      postId,
    ]);
    return post;
  } finally {
    if (con) con.release();
  }
};

exports.deletePost = async (postId) => {
  const con = await getConnection();
  try {
    const isExists = await getOnePost(con, postId);
    if (isExists.length === 0) {
      throw new Error("Ce post n'existe pas.");
    }

    const post = await deletePost(con, postId);
    return post;
  } finally {
    if (con) con.release();
  }
};