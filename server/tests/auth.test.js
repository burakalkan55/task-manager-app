const request = require("supertest");
const app = require("../app"); // Express app
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

describe("AUTH ROUTES", () => {
  const userData = {
    username: "TESTER",
    password: "123456",
  };

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { username: "TESTER" } });
    await prisma.$disconnect();
  });

  it("should register a new user 📝", async () => {
    const res = await request(app).post("/api/auth/register").send(userData);
    expect(res.statusCode).toBe(201);
    console.log("✅ Kayıt testi başarılı: ", res.body.user.username);
  });
  
  it("should login with correct credentials 🔐", async () => {
    const res = await request(app).post("/api/auth/login").send(userData);
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    console.log("✅ Login testi başarılı: ", res.body.user.username);
  });
  
  it("should fail login with wrong password 🚫", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: userData.username,
      password: "wrongpass",
    });
    expect(res.statusCode).toBe(401);
    console.log("✅ Hatalı şifre testi doğru şekilde hata verdi.");
  });
  
  
});
