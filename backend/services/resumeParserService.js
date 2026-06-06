const fs = require("fs");
const pdfParse = require("pdf-parse");

const parseResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    const data = await pdfParse(dataBuffer);

    return data.text;
  } catch (error) {
    throw new Error("Error parsing resume");
  }
};

module.exports = parseResume;
