const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token yok, giriş yapmalısın." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Artık req.user ile giriş yapan kullanıcıya erişebiliriz
    next();
  } catch (error) {
    return res.status(403).json({ message: "Geçersiz token." });
  }
};

module.exports = verifyToken;
