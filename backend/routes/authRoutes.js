const express = require("express");
const protect = require("../middlewares/authMiddleware");

const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Register User
router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", protect, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
