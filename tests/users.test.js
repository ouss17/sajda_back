const request = require("supertest");
const app = require("../app");
const { getConnection } = require("../models/connection_mysql");

describe("User Controller", () => {
  let csrfToken;
  let cookies;

  beforeAll(async () => {
    const response = await request(app).get("/api/csrf-token");
    csrfToken = response.body.csrfToken;
    cookies = response.headers["set-cookie"];
  });

  afterAll(async () => {
      let con;
      try {
        con = await getConnection();
        await con.query('DELETE FROM users WHERE pseudo = ? OR pseudo = ?', ['testuser', 'existinguser']);
      } catch (error) {
        console.error('Erreur lors de la suppression des utilisateurs de test:', error);
      } finally {
        if (con) {
          con.release();
        }
      }
    });

  describe("POST users/signup", () => {
    it("should create a user", async () => {
      console.log("CREATE USER");

      const response = await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          email: "testuser@example.com",
          password: "Test@12345678!",
          lastname: "User",
          firstname: "Test",
          birthDate: "2000-01-01",
          external_id: "123456",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.response).toBe("Utilisateur créé");
    });

        it("should return error for missing fields", async () => {
            console.log("MISSING FIELDS");

          const response = await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "testuser",
            email: "testuser@example.com",
            // Missing other required fields
          });

          expect(response.status).toBe(400);
          expect(response.body.result).toBe(false);
          expect(response.body.error).toBe("Champs manquants ou vides.");
        });

        it("should return an error for bad email attempting", async () => {
            console.log("BAD EMAIL");
          const response = await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "testuser",
            email: "testus.com",
            password: "Test@12345678!",
            lastname: "User",
            firstname: "Test",
            birthDate: "2000-01-01",
            external_id: "123456",
          });

          expect(response.status).toBe(400);
          expect(response.body.result).toBe(false);
          expect(response.body.error).toBe("Veuillez entrer un email valide.");
        });

        it("should return an error for bad password attempting", async () => {
            console.log("BAD PASSWORD");
          const response = await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "testuser",
            email: "testus@gmail.com",
            password: "test1234!",
            lastname: "User",
            firstname: "Test",
            birthDate: "2000-01-01",
            external_id: "123456",
          });

          expect(response.status).toBe(400);
          expect(response.body.result).toBe(false);
        });

        it("should return an error for bad date attempting", async () => {
            console.log("BAD DATE");
          const response = await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "testuser",
            email: "testus@gmail.com",
            password: "Test12345642354!",
            lastname: "User",
            firstname: "Test",
            birthDate: "15-16-2000",
            external_id: "123456",
          });

          expect(response.status).toBe(400);
          expect(response.body.result).toBe(false);
          expect(response.body.error).toBe(`La date entrée est incorrecte.`);
        });
        it("should return error if user already exists", async () => {
            console.log("USER EXISTS");

          await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "existinguser",
            email: "existinguser@example.com",
            password: "Test@12345678!",
            lastname: "User",
            firstname: "Existing",
            birthDate: "2000-01-01",
            external_id: "123456",
          });

          const response = await request(app)
          .post("/users/signup")
          .set("X-CSRF-Token", csrfToken)
          .set("Cookie", cookies)
          .send({
            pseudo: "existinguser",
            email: "existinguser@example.com",
            password: "Test@12345678!",
            lastname: "User",
            firstname: "Existing",
            birthDate: "2000-01-01",
            external_id: "123456",
          });

          expect(response.status).toBe(200);
          expect(response.body.result).toBe(false);
          expect(response.body.error).toBe("L'utilisateur existe déjà !");
        });
  });
});
