const {
  addCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../services/categoriesService");
const { getConnection } = require("../models/connection_mysql");

describe("Categories Service", () => {
  let connection;
  let testCategoryUrl;

  beforeAll(async () => {
    try {
      connection = await getConnection();
    } catch (error) {
      console.error("Error in beforeAll (getConnection):", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      if (connection) {
        await connection.query("DELETE FROM categories WHERE url_name = ?", [testCategoryUrl]);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("addCategory", () => {
    it("should add a new category", async () => {
      const name = "Test Category";
      const comment = "This is a test category.";
      testCategoryUrl = "test-category";

      const result = await addCategory(name, comment, testCategoryUrl);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the category already exists", async () => {
      const name = "Test Category";
      const comment = "This is a duplicate category.";
      const urlName = "test-category";

      await expect(addCategory(name, comment, urlName)).rejects.toThrow("Cette catégorie existe déjà !");
    });
  });

  describe("getCategories", () => {
    it("should retrieve all categories", async () => {
      const categories = await getCategories();
      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);
    });
  });

  describe("updateCategory", () => {
    it("should update an existing category", async () => {
      const name = "Updated Category";
      const comment = "This category has been updated.";
      const urlName = "updated-category";
      const urlCategory = "test-category";

      const result = await updateCategory(name, comment, urlName, urlCategory);
      expect(result.affectedRows).toBe(1);

      // Update the testCategoryUrl for cleanup
      testCategoryUrl = urlName;
    });

    it("should throw an error if the category to update does not exist", async () => {
      const name = "Nonexistent Category";
      const comment = "This category does not exist.";
      const urlName = "nonexistent-category";
      const urlCategory = "nonexistent-category";

      await expect(updateCategory(name, comment, urlName, urlCategory)).rejects.toThrow(
        "La catégorie à modifier n'existe pas !"
      );
    });

    // it("should throw an error if the new urlName already exists", async () => {
    //   const name = "Another Category";
    //   const comment = "This is another category.";
    //   const urlName = "updated-category"; // Already exists
    //   const urlCategory = "test-category";

    //   await expect(updateCategory(name, comment, urlName, urlCategory)).rejects.toThrow(
    //     "Une autre catégorie utilise déjà cet URL !"
    //   );
    // });
  });

  describe("deleteCategory", () => {
    it("should delete an existing category", async () => {
      const result = await deleteCategory(testCategoryUrl);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the category does not exist", async () => {
      const urlCategory = "nonexistent-category";

      await expect(deleteCategory(urlCategory)).rejects.toThrow("Cette catégorie n'existe pas !");
    });
  });
});