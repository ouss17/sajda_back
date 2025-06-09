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
      await con.query(
        'DELETE FROM users WHERE pseudo NOT IN (?, ?)',
        ['testmanu', 'admin']
      );
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

  describe("POST users/signin", () => {
    beforeAll(async () => {
      // Create a user for signin tests
      await request(app)
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
    });

    it("should sign in a user with correct credentials", async () => {
      console.log("SIGN IN USER");

      const response = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          password: "Test@12345678!",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.message).toBe("Utilisateur connecté");
      expect(response.body.data.pseudo).toBe("testuser");
    });

    it("should return error for missing fields", async () => {
      console.log("MISSING FIELDS");

      const response = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          // Missing password
        });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe("Champs manquants ou vides.");
    });

    it("should return error for incorrect password", async () => {
      console.log("INCORRECT PASSWORD");

      const response = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          password: "WrongPassword123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe("Mot de passe erroné");
    });

    it("should return error for non-existent user", async () => {
      console.log("NON-EXISTENT USER");

      const response = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "nonexistentuser",
          password: "Test@12345678!",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe("Utilisateur introuvable");
    });

    it("should handle externalId update during signin", async () => {
      console.log("EXTERNAL ID UPDATE");

      const response = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          password: "Test@12345678!",
          externalId: "newExternalId123",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.message).toBe("Utilisateur connecté");
      expect(response.body.data.pseudo).toBe("testuser");
    });
  });

  describe("GET /users/getMe", () => {
    beforeAll(async () => {
      console.log("CREATE AND SIGN IN USER FOR GET ME");

      await request(app)
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

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          password: "Test@12345678!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should retrieve authenticated user info", async () => {
      console.log("GET ME");

      const response = await request(app)
        .get("/users/getMe")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.data.pseudo).toBe("testuser");
    });
  });

  describe("GET /users", () => {
    beforeAll(async () => {
      console.log("SIGN IN AS TESTMANU FOR RETRIEVE USERS");

      await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmanu",
          email: "testmanu@example.com",
          password: "Testmanu1234cm!",
          lastname: "Manu",
          firstname: "Test",
          birthDate: "1990-01-01",
          external_id: "654321",
        });

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmanu",
          password: "Testmanu1234cm!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should retrieve all users for admin or gerant", async () => {
      console.log("RETRIEVE USERS");

      const response = await request(app)
        .get("/users")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("should return error for unauthorized roles after logout", async () => {
      console.log("UNAUTHORIZED RETRIEVE AFTER LOGOUT");

      await request(app)
        .get("/users/logout")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      const response = await request(app)
        .get("/users")
        .set("X-CSRF-Token", csrfToken);

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /users/update/:userId", () => {
    let userId;

    beforeAll(async () => {
      console.log("CREATE AND SIGN IN USER FOR MODIFY");

      const signupResponse = await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmodify",
          email: "testmodify@example.com",
          password: "Test@12345678!",
          lastname: "Modify",
          firstname: "Test",
          birthDate: "2000-01-01",
          external_id: "123456",
        });

      userId = signupResponse.body.userId;

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmodify",
          password: "Test@12345678!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should modify user details", async () => {
      console.log("MODIFY USER");

      const response = await request(app)
        .put(`/users/update/${userId}`)
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmodify",
          lastname: "Updated",
          firstname: "User",
          birthDate: "1999-01-01",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.response).toBe("Utilisateur modifié");
    });

    it("should return error for invalid date format", async () => {
      console.log("INVALID DATE FORMAT");

      const response = await request(app)
        .put("/users/update/1")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testuser",
          lastname: "Updated",
          firstname: "User",
          birthDate: "01-01-1999",
        });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe("La date entrée est incorrecte.");
    });
  });

  describe("PUT /users/updateRole/:userId", () => {
    let userId;

    beforeAll(async () => {
      console.log("CREATE USER AND SIGN IN AS TESTMANU FOR UPDATE ROLE");

      await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testrole",
          email: "testrole@example.com",
          password: "Test@12345678!",
          lastname: "Role",
          firstname: "Test",
          birthDate: "2000-01-01",
          external_id: "123456",
        });

      const signupManuResponse = await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmanu",
          email: "testmanu@example.com",
          password: "Testmanu1234cm!",
          lastname: "Manu",
          firstname: "Test",
          birthDate: "1990-01-01",
          external_id: "654321",
        });

      userId = signupManuResponse.body.userId;

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmanu",
          password: "Testmanu1234cm!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should modify user role", async () => {
      console.log("MODIFY ROLE");

      const response = await request(app)
        .put(`/users/updateRole/${userId}`)
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          role: "gerant",
          pseudo: "testrole",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.response).toBe("Utilisateur modifié");
    });

    it("should return error for unauthorized role change", async () => {
      console.log("UNAUTHORIZED ROLE CHANGE");

      const response = await request(app)
        .put("/users/updateRole/1")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          role: "admin",
          pseudo: "testuser",
        });

      expect(response.status).toBe(400);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe(
        "Vous ne possédez pas les droits de passer un utilisateur en admin."
      );
    });
  });

  describe("PUT /users/updatePassword/:userId", () => {
    it("should modify user password", async () => {
      console.log("MODIFY PASSWORD");

      const response = await request(app)
        .put("/users/updatePassword/1")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          newPassword: "NewTest@12345678!",
          confirmPassword: "NewTest@12345678!",
          lastPassword: "Test@12345678!",
        });

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.response).toBe("Utilisateur modifié");
    });

    it("should return error for mismatched passwords", async () => {
      console.log("MISMATCHED PASSWORDS");

      const response = await request(app)
        .put("/users/updatePassword/1")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          newPassword: "NewTest@12345678!",
          confirmPassword: "Mismatch@12345678!",
          lastPassword: "Test@12345678!",
        });

      expect(response.status).toBe(500);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe(
        "Le nouveau mot de passe ainsi que sa confirmation doivent être les mêmes !"
      );
    });
  });

  describe("DELETE /users/delete/:userId", () => {
    let userId;

    beforeAll(async () => {
      console.log("CREATE USER AND SIGN IN AS TESTMANU FOR DELETE");

      const signupResponse = await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testdelete",
          email: "testdelete@example.com",
          password: "Test@12345678!",
          lastname: "Delete",
          firstname: "Test",
          birthDate: "2000-01-01",
          external_id: "123456",
        });

      userId = signupResponse.body.userId;

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testmanu",
          password: "Testmanu1234cm!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should delete a user", async () => {
      console.log("DELETE USER");

      const response = await request(app)
        .delete(`/users/delete/${userId}`)
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
      expect(response.body.response).toBe("Utilisateur supprimé");
    });

    it("should return error for unauthorized deletion", async () => {
      console.log("UNAUTHORIZED DELETE");

      const response = await request(app)
        .delete("/users/delete/1")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      expect(response.status).toBe(400);
      expect(response.body.result).toBe(false);
      expect(response.body.error).toBe(
        "Vous n'avez pas les droits pour supprimer cet utilisateur !"
      );
    });
  });

  describe("GET /users/logout", () => {
    beforeAll(async () => {
      console.log("SIGN IN USER FOR LOGOUT");

      await request(app)
        .post("/users/signup")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testlogout",
          email: "testlogout@example.com",
          password: "Test@12345678!",
          lastname: "Logout",
          firstname: "Test",
          birthDate: "2000-01-01",
          external_id: "123456",
        });

      const signinResponse = await request(app)
        .post("/users/signin")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies)
        .send({
          pseudo: "testlogout",
          password: "Test@12345678!",
        });

      cookies = signinResponse.headers["set-cookie"];
    });

    it("should log out the user", async () => {
      console.log("LOGOUT USER");

      const response = await request(app)
        .get("/users/logout")
        .set("X-CSRF-Token", csrfToken)
        .set("Cookie", cookies);

      expect(response.status).toBe(200);
      expect(response.body.result).toBe(true);
    });
  });
});
