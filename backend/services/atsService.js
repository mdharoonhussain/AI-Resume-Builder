const jobDescriptions = require("../utils/jobDescriptionDatabase");

const analyzeResume = (resumeText, jobRole) => {
  const lowerResumeText = resumeText.toLowerCase();

  const requiredSkills = jobDescriptions[jobRole];

  if (!requiredSkills) {
    throw new Error("Invalid job role selected");
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
    jobRole,

    atsScore,

    totalMatchedSkills: matchedSkills.length,

    totalRequiredSkills: requiredSkills.length,

    matchedSkills,

    missingSkills,

    suggestions: suggestions.slice(0, 10),
  };
};

module.exports = analyzeResume;
