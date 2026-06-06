const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const { uploadResume } = require("../controllers/analysisController");

router.post("/upload", protect, upload.single("resume"), uploadResume);

module.exports = router;
