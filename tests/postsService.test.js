const {
  addPost,
  getPostsByMosquee,
  getOnePost,
  getPostsByCategory,
  getPostsAvailable,
  updatePost,
  deletePost,
} = require("../services/postsService");
const { getConnection } = require("../models/connection_mysql");

describe("Posts Service", () => {
  let connection;
  let testPostId;

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
      if (connection && testPostId) {
        await connection.query("DELETE FROM posts WHERE id = ?", [testPostId]);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("addPost", () => {
    it("should add a new post", async () => {
      const postData = {
        title: "Test Post",
        content: "This is a test post.",
        media: "test_media.jpg",
        id_mosquee: 1,
        id_category: 4,
        id_user: 17,
      };

      const result = await addPost(postData);
      expect(result.insertId).toBeDefined();
      testPostId = result.insertId;
    });

    it("should throw an error if required fields are missing", async () => {
      const postData = {
        title: "Test Post",
        content: "This is a test post.",
        // Missing id_category
      };

      await expect(addPost(postData)).rejects.toThrow("Champs manquants ou vides.");
    });
  });

  describe("getOnePost", () => {
    it("should retrieve an existing post", async () => {
      const post = await getOnePost(testPostId);
      expect(post).toBeDefined();
      expect(post.title).toBe("Test Post");
    });

    it("should throw an error if the post does not exist", async () => {
      await expect(getOnePost(9999)).rejects.toThrow("Ce post n'existe pas.");
    });
  });

  describe("getPostsByMosquee", () => {
    it("should retrieve all posts for a specific mosquee", async () => {
      const posts = await getPostsByMosquee(1);
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe("getPostsByCategory", () => {
    it("should retrieve all posts for a specific category and mosquee", async () => {
      const posts = await getPostsByCategory(1, 1);
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe("getPostsAvailable", () => {
    it("should retrieve all available posts", async () => {
      const posts = await getPostsAvailable();
      expect(Array.isArray(posts)).toBe(true);
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      const postData = {
        title: "Updated Post",
        content: "This post has been updated.",
        media: "updated_media.jpg",
        updated_at: new Date().toISOString(),
        active: 1,
        id_category: 4,
        id_user: 17,
      };

      const result = await updatePost(testPostId, postData);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the post does not exist", async () => {
      const postData = {
        title: "Nonexistent Post",
        content: "This post does not exist.",
        media: "nonexistent_media.jpg",
        updated_at: new Date().toISOString(),
        active: 1,
        id_category: 4,
        id_user: 17,
      };

      await expect(updatePost(9999, postData)).rejects.toThrow("Ce post n'existe pas.");
    });
  });

  describe("deletePost", () => {
    it("should delete an existing post", async () => {
      const result = await deletePost(testPostId);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the post does not exist", async () => {
      await expect(deletePost(9999)).rejects.toThrow("Ce post n'existe pas.");
    });
  });
});

