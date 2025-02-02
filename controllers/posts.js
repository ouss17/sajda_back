const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection_mysql");
const {
  createPost,
  getAllPostsByMosquee,
  getOnePost,
  getAllPostsByCategorie,
  updatePost,
  deletePost,
  getAllPostsAvailable,
} = require("../modules/queries/posts_query");

/**
 * Create a post if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addPost = async (req, res) => {
  let { title, content, media, id_mosquee, id_category } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["title", "content", "id_category"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const post = await createPost(con, [
        title,
        content,
        media,
        1,
        id_category,
        id,
      ]);
      if (post.affectedRows === 1) {
        res.json({
          result: true,
          response: "Post créé",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer un post !",
    });
  }
};

/**
 * Get all post by mosquee
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrievePostsByMosquee = async (req, res) => {
  try {
    const posts = await getAllPostsByMosquee(con, req.params.mosqueeId);
    if (posts) {
      res.json({
        result: true,
        data: posts,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

/**
 * Get a post
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrieveOnePost = async (req, res) => {
  try {
    const post = await getOnePost(con, req.params.postId);
    if (post.length > 0) {
      res.json({
        result: true,
        data: post[0],
      });
    } else {
      res.status(500).json({ result: false, error: "Ce post n'existe pas." });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

/**
 * Get all post by category
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrievePostsByCategory = async (req, res) => {
  try {
    const posts = await getAllPostsByCategorie(con, [
      req.params.categoryId,
      req.params.mosqueeId,
    ]);
    if (posts) {
      res.json({
        result: true,
        data: posts,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

/**
 * Get all post available
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrievePostsAvailable = async (req, res) => {
  try {
    const posts = await getAllPostsAvailable(con);
    if (posts) {
      res.json({
        result: true,
        data: posts,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

/**
 * Update a post if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyPost = async (req, res) => {
  let { title, content, media, id_category, active } = req.body;
  let { id, role } = req.user;
  if (!checkBody(req.body, ["title", "content", "id_category", "active"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOnePost(con, [req.params.postId]);
      if (isExists.length > 0) {
        try {
          const now = new Date();

          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); // Mois entre 0-11
          const day = String(now.getDate()).padStart(2, "0");

          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          const seconds = String(now.getSeconds()).padStart(2, "0");

          const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

          const post = await updatePost(con, [
            title,
            content,
            media,
            localDateTime,
            active,
            id_category,
            id,
            req.params.postId,
          ]);
          if (post.affectedRows === 1) {
            res.json({
              result: true,
              response: "Post modifié",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Ce post n'existe pas",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un post !",
    });
  }
};

/**
 * Remove a post if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.removePost = async (req, res) => {
  let { role } = req.user;

  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOnePost(con, [req.params.postId]);
      if (isExists.length > 0) {
        try {
          const post = await deletePost(con, [req.params.postId]);
          if (post.affectedRows === 1) {
            res.json({
              result: true,
              response: "Post supprimé",
            });
          }
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
          res
            .status(500)
            .json({ result: false, error: "Erreur interne du serveur." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Ce post n'existe pas",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un post !",
    });
  }
};
