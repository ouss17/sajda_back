const {
  addMosquee,
  getMosquee,
  getAllAvailableMosquees,
  updateMosquee,
  deleteMosquee,
  getMosqueeCsv,
} = require("../services/mosqueesService");
const { getConnection } = require("../models/connection_mysql");
const fs = require("fs");
const path = require("path");

describe("Mosquees Service", () => {
  let connection;
  let testMosqueeId;

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
      if (connection && testMosqueeId) {
        await connection.query("DELETE FROM mosquees WHERE id = ?", [testMosqueeId]);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("addMosquee", () => {
    it("should add a new mosquee", async () => {
      const mosqueeData = {
        name: "Test Mosquee",
        address: "123 Test Street",
        city: "Test City",
        zip: "12345",
        country: "Test Country",
        dateCreated: "2023-01-01",
        num: "123456789",
        facebook: "test_facebook",
        x: "test_x",
        instagram: "test_instagram",
      };

      const configData = {
        iqama_fajr: 10, // 10 minutes after adhan
        iqama_dhor: 15,
        iqama_asr: 10,
        iqama_maghrib: 5,
        iqama_isha: 10,
        nb_jumuas: 2,
        jumuas: "12:30,13:30",
        color: "#000000",
      };

      const result = await addMosquee(mosqueeData, configData);
      expect(result.mosquee.insertId).toBeDefined();
      testMosqueeId = result.mosquee.insertId;
    });

    it("should throw an error if the mosquee already exists", async () => {
      const mosqueeData = {
        name: "Test Mosquee",
        address: "123 Test Street",
        city: "Test City",
        zip: "12345",
        country: "Test Country",
        dateCreated: "2023-01-01",
        num: "123456789",
        facebook: "test_facebook",
        x: "test_x",
        instagram: "test_instagram",
      };

      const configData = {
        iqama_fajr: 10,
        iqama_dhor: 15,
        iqama_asr: 10,
        iqama_maghrib: 5,
        iqama_isha: 10,
        nb_jumuas: 2,
        jumuas: "12:30,13:30",
        color: "#000000",
      };

      await expect(addMosquee(mosqueeData, configData)).rejects.toThrow("Cette mosquée existe déjà !");
    });
  });

  describe("getMosquee", () => {
    it("should retrieve an existing mosquee", async () => {
      const mosquee = await getMosquee(testMosqueeId);
      expect(mosquee).toBeDefined();
      expect(mosquee.name).toBe("Test Mosquee");
    });

    it("should throw an error if the mosquee does not exist", async () => {
      await expect(getMosquee(9999)).rejects.toThrow("Cette mosquée n'existe pas !");
    });
  });

  describe("getAllAvailableMosquees", () => {
    it("should retrieve all available mosquees", async () => {
      const mosquees = await getAllAvailableMosquees();
      expect(Array.isArray(mosquees)).toBe(true);
      expect(mosquees.length).toBeGreaterThan(0);
    });
  });

  describe("updateMosquee", () => {
    let existingMosqueeId;

    beforeAll(async () => {
      // Ajoute une mosquée existante pour les tests
      const mosqueeData = {
        name: "Existing Mosquee",
        address: "123 Existing Street",
        city: "Existing City",
        zip: "12345",
        country: "Existing Country",
        dateCreated: "2023-01-01",
        num: "123456789",
        facebook: "existing_facebook",
        x: "existing_x",
        instagram: "existing_instagram",
      };

      const configData = {
        iqama_fajr: 10,
        iqama_dhor: 15,
        iqama_asr: 10,
        iqama_maghrib: 5,
        iqama_isha: 10,
        nb_jumuas: 2,
        jumuas: "12:30,13:30",
        color: "#000000",
      };

      const result = await addMosquee(mosqueeData, configData);
      existingMosqueeId = result.mosquee.insertId;
    });

    afterAll(async () => {
      // Supprime la mosquée ajoutée pour les tests
      if (existingMosqueeId) {
        await deleteMosquee(existingMosqueeId);
      }
    });

    it("should update an existing mosquee", async () => {
      const mosqueeData = {
        name: "Updated Mosquee",
        address: "456 Updated Street",
        city: "Updated City",
        zip: "54321",
        country: "Updated Country",
        dateCreated: "2023-01-01",
        num: "987654321",
        facebook: "updated_facebook",
        x: "updated_x",
        instagram: "updated_instagram",
        isAvailable: 1,
      };

      const configData = {
        iqama_fajr: 15,
        iqama_dhor: 20,
        iqama_asr: 15,
        iqama_maghrib: 10,
        iqama_isha: 15,
        nb_jumuas: 1,
        jumuas: "12:30",
        color: "#FFFFFF",
      };

      const result = await updateMosquee(testMosqueeId, mosqueeData, configData);
      expect(result.mosquee.affectedRows).toBe(1);
    });

    it("should throw an error if the mosquee does not exist", async () => {
      const mosqueeData = {
        name: "Nonexistent Mosquee",
        address: "789 Nonexistent Street",
        city: "Nonexistent City",
        zip: "00000",
        country: "Nonexistent Country",
        dateCreated: "2023-01-01",
        num: "000000000",
        facebook: "nonexistent_facebook",
        x: "nonexistent_x",
        instagram: "nonexistent_instagram",
        isAvailable: 1,
      };

      const configData = {
        iqama_fajr: 15,
        iqama_dhor: 20,
        iqama_asr: 15,
        iqama_maghrib: 10,
        iqama_isha: 15,
        nb_jumuas: 1,
        jumuas: "12:30",
        color: "#FFFFFF",
      };

      await expect(updateMosquee(9999, mosqueeData, configData)).rejects.toThrow(
        "Cette mosquée n'existe pas !"
      );
    });

  });

  describe("deleteMosquee", () => {
    it("should delete an existing mosquee", async () => {
      const result = await deleteMosquee(testMosqueeId);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if the mosquee does not exist", async () => {
      await expect(deleteMosquee(9999)).rejects.toThrow("Cette mosquée n'existe pas !");
    });
  });

  describe("getMosqueeCsv", () => {
    it("should retrieve CSV data for a mosquee", async () => {
      const mosqueeId = "test-mosquee";
      const year = "2023";

      // Mock the CSV file
      const csvPath = path.resolve(__dirname, `../ressources/csv/${mosqueeId}/${year}.csv`);
      fs.mkdirSync(path.dirname(csvPath), { recursive: true });
      fs.writeFileSync(csvPath, "01/01/2023;05:00;13:00;16:00;18:30;20:00\n");

      const horaires = await getMosqueeCsv(mosqueeId, year);
      expect(horaires["01/01/2023"]).toEqual(["05:00", "13:00", "16:00", "18:30", "20:00"]);

      // Cleanup
      fs.unlinkSync(csvPath);
      fs.rmdirSync(path.dirname(csvPath), { recursive: true });
    });

    it("should throw an error if the CSV file does not exist", async () => {
      const mosqueeId = "nonexistent-mosquee";
      const year = "2023";

      await expect(getMosqueeCsv(mosqueeId, year)).rejects.toThrow("Fichier non trouvé");
    });
  });
});