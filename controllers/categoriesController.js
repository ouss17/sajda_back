const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../services/categoriesService");
const { checkBody } = require("../modules/checkBody");

exports.addCategory = async (req, res) => {
  const { role } = req.user;
  const { name, comment, urlName } = req.body;

  if (!checkBody(req.body, ["name", "urlName"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const result = await addCategory(name, comment, urlName);
      res.json({ result: true, response: "Catégorie ajoutée" });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour ajouter une catégorie !",
    });
  }
};

exports.retrieveCategories = async (req, res) => {
  try {
    const categories = await getCategories();
    res.json({ result: true, data: categories });
  } catch (error) {
    res.status(500).json({ result: false, error: "Erreur interne du serveur." });
  }
};

exports.modifyCategory = async (req, res) => {
  const { role } = req.user;
  const { name, comment, urlName } = req.body;
  const { urlCategory } = req.params;

  if (!checkBody(req.body, ["name"])) {
    return res
      .status(400)
      .json({ result: false, error: "Champs manquants ou vides." });
  }

  if (role === "admin" || role === "gerant") {
    try {
      const result = await updateCategory(name, comment, urlName, urlCategory);
      res.json({ result: true, response: "Catégorie modifiée" });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier une catégorie !",
    });
  }
};

exports.removeCategory = async (req, res) => {
  const { role } = req.user;
  const { urlCategory } = req.params;

  if (role === "admin" || role === "gerant") {
    try {
      const result = await deleteCategory(urlCategory);
      res.json({ result: true, response: "Catégorie supprimée" });
    } catch (error) {
      res.status(400).json({ result: false, error: error.message });
    }
  } else {
    res.status(403).json({
      result: false,
      error: "Vous n'avez pas les droits pour supprimer une catégorie !",
    });
  }
};
