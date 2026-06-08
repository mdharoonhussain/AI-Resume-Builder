const jobDescriptions = require("../utils/jobDescriptionDatabase");
const extractSkillsFromJD = require("./jdParserService");

const analyzeResume = (resumeText, jobRole, jobDescription) => {
  const lowerResumeText = resumeText.toLowerCase();

  let requiredSkills = [];

  if (jobDescription && jobDescription.trim()) {
    requiredSkills = extractSkillsFromJD(jobDescription);
    console.log(requiredSkills);
  } else {
    requiredSkills = jobDescriptions[jobRole];

    if (!requiredSkills) {
      throw new Error("Invalid job role selected");
    }
  }

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((skill) => {
    if (lowerResumeText.includes(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const atsScore = Math.round(
    (matchedSkills.length / requiredSkills.length) * 100,
  );

  const suggestions = missingSkills.map(
    (skill) => `Consider adding ${skill} experience to your resume`,
  );

  return {
    jobRole: jobDescription && jobDescription.trim() ? "Custom JD" : jobRole,

    atsScore,

    totalMatchedSkills: matchedSkills.length,

    totalRequiredSkills: requiredSkills.length,

    matchedSkills,

    missingSkills,

    suggestions: suggestions.slice(0, 10),
  };
};

module.exports = analyzeResume;
