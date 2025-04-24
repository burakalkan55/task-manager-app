const express = require("express");
const router = express.Router();

// Controller fonksiyonlarını alıyoruz
const { registerUser, loginUser } = require("../controllers/authController");

// Middleware'i dahil et (token kontrolü için)
const verifyToken = require("../middleware/verifyToken");

// Kullanıcı kayıt
router.post("/register", registerUser);

// Kullanıcı giriş
router.post("/login", loginUser);

// Giriş yapan kullanıcı bilgilerini dönen korumalı route
router.get("/me", verifyToken, (req, res) => {
  res.json({
    message: "Token onaylandı!",
    user: req.user // JWT'den gelen id ve username bilgisi
  });
});






module.exports = router;
