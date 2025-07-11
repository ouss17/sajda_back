const { checkBody } = require("../modules/checkBody");
const {
  addPost,
  getPostsByMosquee,
  getOnePost,
  getPostsByCategory,
  getPostsAvailable,
  updatePost,
  deletePost,
} = require("../services/postsService");

exports.addPost = async (req, res) => {
  const { title, content, media, id_mosquee, id_category } = req.body;
  const { id, role } = req.user;

  if (!checkBody(req.body, ["title", "content", "id_category"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const post = await addPost({
        title,
        content,
        media,
        id_mosquee,
        id_category,
        id_user: id,
      });
      res.json({ result: true, response: "Post créé", data: post });
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      res.status(500).json({ result: false, error: "Erreur interne du serveur." });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour créer un post !",
    });
  }
};

exports.retrievePostsByMosquee = async (req, res) => {
  try {
    const posts = await getPostsByMosquee(req.params.mosqueeId);
    res.json({ result: true, data: posts });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.retrieveOnePost = async (req, res) => {
  try {
    const post = await getOnePost(req.params.postId);
    res.json({ result: true, data: post });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(400).json({ result: false, error: error.message });
  }
};

exports.retrievePostsByCategory = async (req, res) => {
  try {
    const posts = await getPostsByCategory(
      req.params.categoryId,
      req.params.mosqueeId
    );
    res.json({ result: true, data: posts });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.retrievePostsAvailable = async (req, res) => {
  try {
    const posts = await getPostsAvailable();
    res.json({ result: true, data: posts });
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.modifyPost = async (req, res) => {
  const { title, content, media, id_category, active } = req.body;
  const { id, role } = req.user;
  
  if (!checkBody(req.body, ["title", "content", "id_category"])) {
    return res.status(400).json({
      result: false,
      error: "Vous n'avez pas rempli tous les champs.",
    });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const now = new Date();
      const updated_at = now.toISOString();

      const post = await updatePost(req.params.postId, {
        title,
        content,
        media,
        updated_at,
        active,
        id_category,
        id_user: id,
      });
      res.json({ result: true, response: "Post modifié", data: post });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier un post !",
    });
  }
};

exports.removePost = async (req, res) => {
  const { role } = req.user;

  if (role === "admin" || role === "gerant") {
    try {
      const post = await deletePost(req.params.postId);
      res.json({ result: true, response: "Post supprimé", data: post });
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer un post !",
    });
  }
};
