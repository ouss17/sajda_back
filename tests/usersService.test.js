const {
  signupUser,
  signinUser,
  getAllUsers,
  getAuthenticatedUser,
  updateUser,
  updateUserRole,
  updateUserPassword,
  deleteUser,
} = require("../services/usersService");
const { getConnection } = require("../models/connection_mysql");

describe("Users Service", () => {
  let connection;

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
        await connection.query('DELETE FROM users WHERE pseudo NOT IN (?, ?)', ['testmanu', 'testmanu23']);
        connection.release();
      }
    } catch (error) {
      console.error("Error in afterAll (cleanup):", error);
      throw error;
    }
  });

  describe("signupUser", () => {
    it("should create a user", async () => {
      const userData = {
        pseudo: "testuser",
        email: "testuser@example.com",
        password: "Test@12345678!",
        lastname: "User",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      try {
        const result = await signupUser(userData);
        expect(result.affectedRows).toBe(1);
      } catch (error) {
        console.error("Error in signupUser test (should create a user):", error);
        throw error;
      }
    });

    it("should throw an error for missing fields", async () => {
      const userData = {
        pseudo: "testuser",
        email: "testuser@example.com",
        // Missing other required fields
      };

      try {
        await expect(signupUser(userData)).rejects.toThrow("Champs manquants ou vides.");
      } catch (error) {
        console.error("Error in signupUser test (missing fields):", error);
        throw error;
      }
    });

    it("should throw an error for invalid email", async () => {
      const userData = {
        pseudo: "testuser",
        email: "invalidemail",
        password: "Test@12345678!",
        lastname: "User",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      try {
        await expect(signupUser(userData)).rejects.toThrow("Veuillez entrer un email valide.");
      } catch (error) {
        console.error("Error in signupUser test (invalid email):", error);
        throw error;
      }
    });

    it("should throw an error for invalid password", async () => {
      const userData = {
        pseudo: "testuser",
        email: "testuser@example.com",
        password: "short",
        lastname: "User",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      try {
        await expect(signupUser(userData)).rejects.toThrow("Veuillez écrire un mot de passe qui correspond à une de ces conditions");
      } catch (error) {
        console.error("Error in signupUser test (invalid password):", error);
        throw error;
      }
    });

    it("should throw an error for invalid date format", async () => {
      const userData = {
        pseudo: "testuser",
        email: "testuser@example.com",
        password: "Test@12345678!",
        lastname: "User",
        firstname: "Test",
        birthDate: "invalid-date",
        externalId: "12345678",
      };

      try {
        await expect(signupUser(userData)).rejects.toThrow("La date entrée est incorrecte.");
      } catch (error) {
        console.error("Error in signupUser test (invalid date format):", error);
        throw error;
      }
    });

    it("should throw an error if user already exists", async () => {
      const userData = {
        pseudo: "existinguser",
        email: "existinguser@example.com",
        password: "Test@12345678!",
        lastname: "User",
        firstname: "Existing",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      try {
        await signupUser(userData);
        await expect(signupUser(userData)).rejects.toThrow("L'utilisateur existe déjà !");
      } catch (error) {
        console.error("Error in signupUser test (user already exists):", error);
        throw error;
      }
    });
  });

  describe("signinUser", () => {
    beforeAll(async () => {
      const userData = {
        pseudo: "testsignin",
        email: "testsignin@example.com",
        password: "Test@12345678!",
        lastname: "Signin",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      try {
        await signupUser(userData);
      } catch (error) {
        console.error("Error in signinUser beforeAll (signupUser):", error);
        throw error;
      }
    });

    it("should sign in a user with correct credentials", async () => {
      try {
        const result = await signinUser("testsignin", "Test@12345678!");
        expect(result.user.pseudo).toBe("testsignin");
        expect(result.token).toBeDefined();
      } catch (error) {
        console.error("Error in signinUser test (correct credentials):", error);
        throw error;
      }
    });

    it("should throw an error for incorrect password", async () => {
      try {
        await expect(signinUser("testsignin", "WrongPassword123!")).rejects.toThrow("Mot de passe erroné");
      } catch (error) {
        console.error("Error in signinUser test (incorrect password):", error);
        throw error;
      }
    });

    it("should throw an error for non-existent user", async () => {
      try {
        await expect(signinUser("nonexistentuser", "Test@12345678!")).rejects.toThrow("Utilisateur introuvable");
      } catch (error) {
        console.error("Error in signinUser test (non-existent user):", error);
        throw error;
      }
    });

    it("should update externalId during signin", async () => {
      try {
        const result = await signinUser("testsignin", "Test@12345678!", "newExternalId123");
        expect(result.user.pseudo).toBe("testsignin");
      } catch (error) {
        console.error("Error in signinUser test (update externalId):", error);
        throw error;
      }
    });
  });

  describe("getAllUsers", () => {
    it("should retrieve all users", async () => {
      const users = await getAllUsers();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  describe("getAuthenticatedUser", () => {
    it("should retrieve authenticated user info", async () => {
      const user = await getAuthenticatedUser("testsignin");
      expect(user.pseudo).toBe("testsignin");
    });
  });

  describe("updateUser", () => {
    let userId;

    beforeAll(async () => {
      const userData = {
        pseudo: "testupdate",
        email: "testupdate@example.com",
        password: "Test@12345678!",
        lastname: "Update",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      const result = await signupUser(userData);
      userId = result.insertId;
    });

    it("should update user details", async () => {
      const result = await updateUser(userId, "testupdate", {
        pseudo: "updateduser",
        firstname: "Updated",
        lastname: "User",
        birthDate: "1999-01-01",
      });

      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if user does not exist", async () => {
      await expect(
        updateUser(9999, "nonexistent", {
          pseudo: "updateduser",
          firstname: "Updated",
          lastname: "User",
          birthDate: "1999-01-01",
        })
      ).rejects.toThrow("Utilisateur introuvable.");
    });
  });

  describe("updateUserRole", () => {
    let userId;

    beforeAll(async () => {
      const userData = {
        pseudo: "testrole",
        email: "testrole@example.com",
        password: "Test@12345678!",
        lastname: "Role",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      const result = await signupUser(userData);
      userId = result.insertId;
    });

    it("should update user role", async () => {
      const result = await updateUserRole(userId, "gerant");
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if user does not exist", async () => {
      await expect(updateUserRole(9999, "admin")).rejects.toThrow("Utilisateur introuvable.");
    });
  });

  describe("updateUserPassword", () => {
    let userId;

    beforeAll(async () => {
      const userData = {
        pseudo: "testpassword",
        email: "testpassword@example.com",
        password: "Test@12345678!",
        lastname: "Password",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      const result = await signupUser(userData);
      userId = result.insertId;
    });

    it("should update user password", async () => {
      const result = await updateUserPassword(userId, "NewTest@12345678!");
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if user does not exist", async () => {
      await expect(updateUserPassword(9999, "NewTest@12345678!")).rejects.toThrow("Utilisateur introuvable.");
    });

    it("should throw an error for invalid password format", async () => {
      await expect(updateUserPassword(userId, "short")).rejects.toThrow(
        "Veuillez écrire un mot de passe qui correspond à une de ces conditions"
      );
    });
  });

  describe("deleteUser", () => {
    let userId;

    beforeAll(async () => {
      const userData = {
        pseudo: "testdelete",
        email: "testdelete@example.com",
        password: "Test@12345678!",
        lastname: "Delete",
        firstname: "Test",
        birthDate: "2000-01-01",
        externalId: "12345678",
      };

      const result = await signupUser(userData);
      userId = result.insertId;
    });

    it("should delete a user", async () => {
      const result = await deleteUser(userId);
      expect(result.affectedRows).toBe(1);
    });

    it("should throw an error if user does not exist", async () => {
      await expect(deleteUser(9999)).rejects.toThrow("Utilisateur introuvable.");
    });
  });
});