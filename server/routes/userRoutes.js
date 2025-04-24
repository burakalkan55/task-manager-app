const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs");



// ✅ PROFİL GÜNCELLEME
router.post("/updateProfile", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ message: "Bu kullanıcı adı zaten kullanılıyor" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username },
    });

    console.log("✅ Profil güncellendi:", updatedUser.username);
    res.json({ message: "Profil güncellendi ✅", user: updatedUser });
  } catch (error) {
    console.error("❌ Profil güncelleme hatası:", error);
    res.status(500).json({ message: "Profil güncellenemedi" });
  }
});

// ✅ ŞİFRE GÜNCELLEME
router.post("/changePassword", verifyToken, async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(400).json({ message: "Mevcut şifre yanlış" });

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNew },
    });

    console.log("✅ Şifre değiştirildi");
    res.json({ message: "Şifre başarıyla değiştirildi ✅" });
  } catch (error) {
    console.error("❌ Şifre değiştirme hatası:", error);
    res.status(500).json({ message: "Şifre güncellenemedi" });
  }
});

// ✅ GÖREV EKLEME
router.post("/tasks", verifyToken, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newTask = await prisma.task.create({
      data: { text, done: false, userId },
    });
    console.log("✅ Görev ekleme başarılı:", newTask.text);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Görev ekleme hatası:", error);
    res.status(500).json({ message: "Görev eklenemedi" });
  }
});

// ✅ GÖREVLERİ LİSTELEME
router.get("/tasks", verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Görev listeleme hatası:", error);
    res.status(500).json({ message: "Görevler getirilemedi" });
  }
});

// ✅ GÖREV GÜNCELLEME
router.put("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const userId = req.user.id;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: parseInt(id), userId },
      data: { done },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Görev güncelleme hatası:", error);
    res.status(500).json({ message: "Görev güncellenemedi" });
  }
});

// ✅ GÖREV SİLME
router.delete("/tasks/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await prisma.task.delete({
      where: { id: parseInt(id), userId },
    });
    res.json({ message: "Görev silindi 🗑️" });
  } catch (error) {
    console.error("Görev silme hatası:", error);
    res.status(500).json({ message: "Görev silinemedi" });
  }
});

module.exports = router;