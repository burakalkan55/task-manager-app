const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const verifyToken = require("../middleware/verifyToken");

// ✅ Görev Ekleme
router.post("/", verifyToken, async (req, res) => {
  const { text } = req.body;
  const userId = req.user.id;

  try {
    const newTask = await prisma.task.create({
      data: {
        text,
        done: false,
        userId, // userId doğrudan tanımlanmalı
      },
    });
    console.log("✅ Görev eklendi:", newTask.text);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("❌ Görev ekleme hatası:", error);
    res.status(500).json({ message: "Görev eklenemedi" });
  }
});

// ✅ Görev Listeleme (Kullanıcıya ait)
router.get("/", verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    console.error("❌ Görev listeleme hatası:", error);
    res.status(500).json({ message: "Görevler getirilemedi" });
  }
});

// ✅ Görev Güncelleme (Done true/false)
router.put("/:id", verifyToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { done } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { done },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("❌ Görev güncelleme hatası:", error);
    res.status(500).json({ message: "Görev güncellenemedi" });
  }
});

// ✅ Görev Silme
router.delete("/:id", verifyToken, async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.json({ message: "Görev silindi" });
  } catch (error) {
    console.error("❌ Görev silme hatası:", error);
    res.status(500).json({ message: "Görev silinemedi" });
  }
});

module.exports = router;
