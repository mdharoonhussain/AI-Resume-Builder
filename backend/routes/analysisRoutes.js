const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const upload = require("../middlewares/uploadMiddleware");

const {
  uploadResume,
  getAnalysisHistory,
  getAnalysisById,
  deleteAnalysis,
} = require("../controllers/analysisController");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/history", protect, getAnalysisHistory);
router.get("/:id", protect, getAnalysisById);
router.delete("/:id", protect, deleteAnalysis);

module.exports = router;
