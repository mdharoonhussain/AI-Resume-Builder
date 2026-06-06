const Analysis = require("../models/Analysis");

const parseResume = require("../services/resumeParserService");

const analyzeResume = require("../services/atsService");

const uploadResume = async (req, res) => {
  try {
    // Check file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
    }

    // Check job role
    const { jobRole } = req.body;

    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: "Please select a job role",
      });
    }

    // Extract text from resume
    const resumeText = await parseResume(req.file.path);

    // Analyze resume against selected job role
    const analysisResult = analyzeResume(resumeText, jobRole);

    // Save analysis in MongoDB
    const analysis = await Analysis.create({
      userId: req.user.userId,

      jobRole,

      fileName: req.file.originalname,

      filePath: req.file.path,

      resumeText,

      atsScore: analysisResult.atsScore,

      matchingSkills: analysisResult.matchedSkills,

      missingSkills: analysisResult.missingSkills,

      suggestions: analysisResult.suggestions,
    });

    // Response
    res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",

      analysisId: analysis._id,

      fileName: analysis.fileName,

      jobRole: analysisResult.jobRole,

      atsScore: analysisResult.atsScore,

      totalMatchedSkills: analysisResult.totalMatchedSkills,

      totalRequiredSkills: analysisResult.totalRequiredSkills,

      matchedSkills: analysisResult.matchedSkills,

      missingSkills: analysisResult.missingSkills,

      suggestions: analysisResult.suggestions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadResume,
};
