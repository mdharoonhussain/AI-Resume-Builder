const skillsDatabase = require("../utils/skillsDatabase");

const extractSkillsFromJD = (jobDescription) => {
  const lowerJD = jobDescription.toLowerCase();

  const extractedSkills = [];

  Object.values(skillsDatabase)
    .flat()
    .forEach((skill) => {
      if (lowerJD.includes(skill.toLowerCase())) {
        extractedSkills.push(skill);
      }
    });

  return [...new Set(extractedSkills)];
};

module.exports = extractSkillsFromJD;
