const {
  addFeedback,
  getOneFeedback,
  getFeedbacksByMosquee,
  getFeedbacksByTarget,
  getFeedbacksByUser,
  updateFeedback,
  deleteFeedback,
} = require("../services/feedbacksService");
const { getConnection } = require("../models/connection_mysql");

describe("Feedbacks Service", () => {
  let connection;
  let testFeedbackId;

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
      if (connection && testFeedbackId) {
        await connection.query("DELETE FROM feedbacks WHERE id = ?", [testFeedbackId]);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("addFeedback", () => {
    it("should add a new feedback", async () => {
      const feedbackData = {
        title: "Test Feedback",
        detail: "This is a test feedback.",
        target: "mosquee",
        id_mosquee: 1,
        id_user: 17,
      };

      const result = await addFeedback(feedbackData);
      expect(result.insertId).toBeDefined();
      testFeedbackId = result.insertId;
    });

    it("should throw an error if required fields are missing", async () => {
      const feedbackData = {
        title: "Test Feedback",
        detail: "This is a test feedback.",
        // Missing target
      };

      await expect(addFeedback(feedbackData)).rejects.toThrow("Vous n'avez pas rempli tous les champs.");
    });
  });

  describe("getOneFeedback", () => {
    it("should retrieve an existing feedback", async () => {
      const feedback = await getOneFeedback(testFeedbackId);
      expect(feedback).toBeDefined();
      expect(feedback.title).toBe("Test Feedback");
    });

    it("should throw an error if the feedback does not exist", async () => {
      await expect(getOneFeedback(9999)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });

  describe("getFeedbacksByMosquee", () => {
    it("should retrieve all feedbacks for a specific mosquee", async () => {
      const feedbacks = await getFeedbacksByMosquee(1);
      expect(Array.isArray(feedbacks)).toBe(true);
    });
  });

  describe("getFeedbacksByTarget", () => {
    it("should retrieve all feedbacks for a specific target and mosquee", async () => {
      const feedbacks = await getFeedbacksByTarget(1, "mosquee");
      expect(Array.isArray(feedbacks)).toBe(true);
    });
  });

  describe("getFeedbacksByUser", () => {
    it("should retrieve all feedbacks for a specific user", async () => {
      const feedbacks = await getFeedbacksByUser(17);
      expect(Array.isArray(feedbacks)).toBe(true);
    });
  });

  describe("updateFeedback", () => {
    it("should update an existing feedback", async () => {
      const feedbackData = {
        checked: 1,
        responded: 1,
      };

      const result = await updateFeedback(testFeedbackId, feedbackData);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the feedback does not exist", async () => {
      const feedbackData = {
        checked: 1,
        responded: "This feedback does not exist.",
      };

      await expect(updateFeedback(9999, feedbackData)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });

  describe("deleteFeedback", () => {
    it("should delete an existing feedback", async () => {
      const result = await deleteFeedback(testFeedbackId);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the feedback does not exist", async () => {
      await expect(deleteFeedback(9999)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });
});