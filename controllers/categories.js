const { checkBody } = require("../modules/checkBody");
const con = require("../models/connection_mysql");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getOneCategory,
} = require("../modules/queries/categories_query");

/**
 * Create a category if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.addCategory = async (req, res) => {
  const { role } = req.user;
  const { name, comment, urlName } = req.body;
  if (!checkBody(req.body, ["name", "urlName"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOneCategory(con, [urlName]);
      if (isExists.length === 0) {
        try {
          const category = await createCategory(con, [name, comment, urlName]);
          if (category.affectedRows === 1) {
            res.json({
              result: true,
              response: "Catégorie ajoutée",
            });
          }
        } catch (error) {
          console.error("Error during create:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Cette catégorie existe déjà !",
        });
      }
    } catch (error) {
      console.error("Error during create:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour ajouter une catégorie !",
    });
  }
};

/**
 * Get all categories
 * @param {*} req unrequired
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database
 */
exports.retrieveCategories = async (req, res) => {
  try {
    const categories = await getAllCategories(con);
    if (categories) {
      res.json({ result: true, data: categories });
    }
  } catch (error) {
    console.error("Error during retrieve:", error);
    res.status(500).json({ result: false, error: "Internal server error." });
  }
};

/**
 * Update a category if user is at least "gerant"
 * @param {Object} req Object of the request
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed or required fields are empty
 */
exports.modifyCategory = async (req, res) => {
  const { role } = req.user;
  const { name, comment, urlName } = req.body;
  if (!checkBody(req.body, ["name"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }
  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOneCategory(con, [urlName]);
      if (isExists.length === 0 || req.params.urlCategory === urlName) {
        try {
          const category = await updateCategory(con, [
            name,
            comment,
            urlName,
            req.params.urlCategory,
          ]);
          if (category.affectedRows === 1) {
            res.json({
              result: true,
              response: "Catégorie modifiée",
            });
          }
        } catch (error) {
          console.error("Error during update:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Cette catégorie existe déjà !",
        });
      }
    } catch (error) {
      console.error("Error during create:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour modifier une catégorie !",
    });
  }
};

/**
 * Remove a category if user is at least "gerant"
 * @param {Object} req unrequired
 * @param {Object} res Object of the response
 * @returns {Object} Object response
 * @throws Exception if error occured in database, if authentification failed
 */
exports.removeCategory = async (req, res) => {
  const { role } = req.user;
  if (role === "admin" || role === "gerant") {
    try {
      const isExists = await getOneCategory(con, req.params.urlCategory);
      if (isExists.length > 0) {
        try {
          const category = await deleteCategory(con, [req.params.urlCategory]);
          if (category.affectedRows === 1) {
            res.json({
              result: true,
              response: "Catégorie supprimée",
            });
          }
        } catch (error) {
          console.error("Error during delete:", error);
          res
            .status(500)
            .json({ result: false, error: "Internal server error." });
        }
      } else {
        res.status(400).json({
          result: false,
          error: "Cette catégorie n'existe pas !",
        });
      }
    } catch (error) {
      console.error("Error during retrieve:", error);
      res.status(500).json({ result: false, error: "Internal server error." });
    }
  } else {
    res.status(400).json({
      result: false,
      error: "Vous n'avez pas les droits pour surrpimer une catégorie !",
    });
  }
};
