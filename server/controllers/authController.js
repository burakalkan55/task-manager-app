const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Kullanıcı adı zaten alınmış" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      }
    });

    res.status(201).json({ message: "Kayıt başarılı", user: { id: newUser.id, username: newUser.username } });

  } catch (error) {
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username
      },
      select: {
        id: true,
        username: true,
        password: true
      }
    });

    if (!user) {
      await prisma.loginLog.create({ data: { username, success: false } });
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await prisma.loginLog.create({ data: { username, success: false } });
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });
    

    await prisma.loginLog.create({ data: { username, success: true } });

    res.json({ token, user: { id: user.id, username: user.username } });

  } catch (error) {
    console.error("Login Error:", error); // logla mutlaka!
    res.status(500).json({ message: "Sunucu hatası", error });
  }
};

module.exports = { registerUser, loginUser };
