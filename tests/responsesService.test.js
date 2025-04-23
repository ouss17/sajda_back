const {
  addResponse,
  getOneResponse,
  getResponsesByUser,
  updateResponse,
  deleteResponse,
} = require("../services/responsesService");
const { getConnection } = require("../models/connection_mysql");

describe("Responses Service", () => {
  let connection;
  let testResponseId;

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
      if (connection && testResponseId) {
        await connection.query("DELETE FROM responses_feedback WHERE id = ?", [testResponseId]);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("addResponse", () => {
    it("should add a new response", async () => {
      const responseData = {
        response: "This is a test response.",
        idFeedback: 10,
        idUserWhoAsk: 18,
        idResponder: 17,
      };

      const result = await addResponse(responseData);
      expect(result.insertId).toBeDefined();
      testResponseId = result.insertId;
    });

    it("should throw an error if required fields are missing", async () => {
      const responseData = {
        response: "This is a test response.",
        idFeedback: 1,
        // Missing idUserWhoAsk
      };

      await expect(addResponse(responseData)).rejects.toThrow("Vous n'avez pas rempli tous les champs.");
    });
  });

  describe("getOneResponse", () => {
    it("should retrieve an existing response", async () => {
      const response = await getOneResponse(testResponseId);
      expect(response).toBeDefined();
      expect(response.response).toBe("This is a test response.");
    });

    it("should throw an error if the response does not exist", async () => {
      await expect(getOneResponse(9999)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });

  describe("getResponsesByUser", () => {
    it("should retrieve all responses for a specific user", async () => {
      const responses = await getResponsesByUser(17);
      expect(Array.isArray(responses)).toBe(true);
    });
  });

  describe("updateResponse", () => {
    it("should update an existing response", async () => {
      const responseData = {
        response: "This response has been updated.",
      };

      const result = await updateResponse(testResponseId, responseData);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the response does not exist", async () => {
      const responseData = {
        response: "This response does not exist.",
      };

      await expect(updateResponse(9999, responseData)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });

  describe("deleteResponse", () => {
    it("should delete an existing response", async () => {
      const result = await deleteResponse(testResponseId);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the response does not exist", async () => {
      await expect(deleteResponse(9999)).rejects.toThrow("Ce feedback n'existe pas.");
    });
  });
});