const request = require("supertest");
const app = require("../app");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("USER ROUTES", () => {
  let authToken;
  let userId;
  let taskId;

  const testUser = {
    username: "testuser",
    password: "test123"
  };

  beforeAll(async () => {
    try {
      // Clean up any existing test data
      await prisma.task.deleteMany();
      await prisma.user.deleteMany();

      // Register new test user
      const registerRes = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      // Login and get token
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      authToken = loginRes.body.token;
      userId = loginRes.body.user.id;
    } catch (error) {
      console.error("Test setup failed:", error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await prisma.task.deleteMany();
      await prisma.user.deleteMany();
      await prisma.$disconnect();
    } catch (error) {
      console.error("Cleanup failed:", error);
      throw error;
    }
  });

  describe("Profile Operations 👤", () => {
    it("should update username", async () => {
      const newUsername = "updateduser" + Date.now(); // Ensure unique username
      const res = await request(app)
        .post("/api/users/updateProfile")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: newUsername });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.user.username).toBe(newUsername);
      console.log("✅ Profil güncelleme testi başarılı:", newUsername);
    });

    it("should not allow duplicate username", async () => {
      const duplicateUser = {
        username: "duplicateuser",
        password: "test123"
      };

      // Create a user first
      await request(app)
        .post("/api/auth/register")
        .send(duplicateUser);

      // Try to update to the same username
      const res = await request(app)
        .post("/api/users/updateProfile")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ username: duplicateUser.username });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain("kullanıcı adı zaten kullanılıyor");
      console.log("✅ Duplicate username testi başarılı");
    });

    it("should change password", async () => {
      const res = await request(app)
        .post("/api/users/changePassword")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: "newPassword123"
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Şifre başarıyla güncellendi");
      console.log("✅ Şifre değiştirme testi başarılı");
    });
  });

  describe("Task Operations 📝", () => {
    it("should create a new task", async () => {
      const res = await request(app)
        .post("/api/users/tasks")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ text: "Test görevi" });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.text).toBe("Test görevi");
      taskId = res.body.id;
      console.log("✅ Görev oluşturma testi başarılı:", res.body.text);
    });

    it("should list all tasks", async () => {
      const res = await request(app)
        .get("/api/users/tasks")
        .set("Authorization", `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      console.log("✅ Görev listeleme testi başarılı");
    });

    it("should update a task", async () => {
      const res = await request(app)
        .put(`/api/users/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ done: true });
      
      expect(res.statusCode).toBe(200);
      expect(res.body.done).toBeTruthy();
      console.log("✅ Görev güncelleme testi başarılı");
    });

    it("should delete a task", async () => {
      const res = await request(app)
        .delete(`/api/users/tasks/${taskId}`)
        .set("Authorization", `Bearer ${authToken}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Görev silindi");
      console.log("✅ Görev silme testi başarılı");
    });
  });

  describe("Authentication Check ⚡", () => {
    it("should fail without auth token", async () => {
      const res = await request(app)
        .get("/api/users/tasks");
      
      expect(res.statusCode).toBe(401);
      console.log("✅ Token kontrolü testi başarılı");
    });
  });
});