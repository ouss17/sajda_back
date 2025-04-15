const { getConnection } = require("../models/connection_mysql");
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getOneCategory,
} = require("../modules/queries/categories_query");

exports.addCategory = async (name, comment, urlName) => {
  const con = await getConnection();
  try {
    // Vérifie si la catégorie existe déjà
    const existingCategory = await getOneCategory(con, [urlName]);
    if (existingCategory.length > 0) {
      throw new Error("Cette catégorie existe déjà !");
    }

    // Ajoute la catégorie
    const result = await createCategory(con, [name, comment, urlName]);
    return result;
  } finally {
    if (con) con.release();
  }
};

exports.getCategories = async () => {
  const con = await getConnection();
  try {
    const categories = await getAllCategories(con);
    return categories;
  } finally {
    if (con) con.release();
  }
};

exports.updateCategory = async (name, comment, urlName, urlCategory) => {
  const con = await getConnection();
  try {
    // Vérifie si la catégorie à modifier existe
    const categoryToUpdate = await getOneCategory(con, [urlCategory]);
    if (categoryToUpdate.length === 0) {
      throw new Error("La catégorie à modifier n'existe pas !");
    }

    // Vérifie si une autre catégorie utilise déjà le même urlName
    const existingCategory = await getOneCategory(con, [urlName]);
    if (existingCategory.length > 0 && urlName !== urlCategory) {
      throw new Error("Une autre catégorie utilise déjà cet URL !");
    }

    // Met à jour la catégorie
    const result = await updateCategory(con, [name, comment, urlName, urlCategory]);
    return result;
  } finally {
    if (con) con.release();
  }
};

exports.deleteCategory = async (urlCategory) => {
  const con = await getConnection();
  try {
    // Vérifie si la catégorie existe
    const existingCategory = await getOneCategory(con, [urlCategory]);
    if (existingCategory.length === 0) {
      throw new Error("Cette catégorie n'existe pas !");
    }

    // Supprime la catégorie
    const result = await deleteCategory(con, [urlCategory]);
    return result;
  } finally {
    if (con) con.release();
  }
};