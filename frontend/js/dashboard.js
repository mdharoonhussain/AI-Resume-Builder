const API_URL = "https://ai-resume-analyzer-kbbv.onrender.com/api";

const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

const deleteModal = document.getElementById("deleteModal");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const toast = document.getElementById("toast");

const pdfModal = document.getElementById("pdfModal");

const pdfModalOkBtn = document.getElementById("pdfModalOkBtn");

let currentAnalysis = null;

let deleteId = null;

// Redirect if not logged in
if (!token) {
  window.location.href = "./login.html";
}

// Welcome User
document.getElementById("welcomeUser").textContent = `Welcome, ${user.name} 👋`;

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "./login.html";
});

// Upload Resume
const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const file = document.getElementById("resume").files[0];

  const jobRole = document.getElementById("jobRole").value;

  const jobDescription = document.getElementById("jobDescription").value;
  if (!jobRole && !jobDescription.trim()) {
    document.getElementById("uploadMessage").textContent =
      "Please select a Job Role or paste a Job Description";

    return;
  }

  const formData = new FormData();

  formData.append("resume", file);

  formData.append("jobRole", jobRole);

  formData.append("jobDescription", jobDescription);

  try {
    const response = await fetch(`${API_URL}/analysis/upload`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      document.getElementById("uploadMessage").textContent =
        "Resume analyzed successfully";

      displayAnalysis(data);

      loadHistory();
    } else {
      document.getElementById("uploadMessage").textContent = data.message;
    }
  } catch (error) {
    console.error(error);

    document.getElementById("uploadMessage").textContent =
      "Something went wrong";
  }
});

// Display Analysis Result
function displayAnalysis(data) {
  currentAnalysis = data;
  console.log(currentAnalysis);
  const score = data.atsScore;

  document.getElementById("atsScore").textContent = `${score}%`;

  const circle = document.getElementById("progressCircle");

  const radius = 80;

  const circumference = 2 * Math.PI * radius;

  const offset = circumference - (score / 100) * circumference;

  circle.style.strokeDashoffset = offset;

  // Dynamic Color

  if (score < 40) {
    circle.style.stroke = "#ef4444"; // Red

    document.getElementById("atsScore").style.color = "#ef4444";
  } else if (score < 70) {
    circle.style.stroke = "#f59e0b"; // Orange

    document.getElementById("atsScore").style.color = "#f59e0b";
  } else {
    circle.style.stroke = "#10b981"; // Green

    document.getElementById("atsScore").style.color = "#10b981";
  }

  const matchedSkills = document.getElementById("matchedSkills");

  const missingSkills = document.getElementById("missingSkills");

  const suggestions = document.getElementById("suggestions");

  matchedSkills.innerHTML = "";
  missingSkills.innerHTML = "";
  suggestions.innerHTML = "";

  data.matchedSkills.forEach((skill) => {
    matchedSkills.innerHTML += `
    <span class="skill-tag matched-tag">
      ${skill}
    </span>
  `;
  });

  data.missingSkills.forEach((skill) => {
    missingSkills.innerHTML += `
    <span class="skill-tag missing-tag">
      ${skill}
    </span>
  `;
  });

  data.suggestions.forEach((item) => {
    suggestions.innerHTML += `
    <div class="suggestion-item">
      • ${item}
    </div>
  `;
  });
}

function updateStatistics(analyses) {
  const totalReports = analyses.length;

  let highestScore = 0;

  let totalScore = 0;

  analyses.forEach((analysis) => {
    totalScore += analysis.atsScore;

    if (analysis.atsScore > highestScore) {
      highestScore = analysis.atsScore;
    }
  });

  const averageScore =
    totalReports > 0 ? Math.round(totalScore / totalReports) : 0;

  document.getElementById("totalReports").textContent = totalReports;

  document.getElementById("highestScore").textContent = `${highestScore}%`;

  document.getElementById("averageScore").textContent = `${averageScore}%`;
}

// Load History
async function loadHistory() {
  try {
    const response = await fetch(`${API_URL}/analysis/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    const historyContainer = document.getElementById("historyContainer");

    historyContainer.innerHTML = "";
    updateStatistics(data.analyses);

    data.analyses.forEach((analysis) => {
      historyContainer.innerHTML += `
        <div class="history-item">

          <div>
            <strong>${analysis.fileName}</strong>
            <br>
            ${analysis.jobRole}
            <br>
            ATS Score:
            ${analysis.atsScore}%
          </div>

          <div class="history-actions">

            <button
              class="view-btn"
              onclick="viewAnalysis('${analysis._id}')"
            >
              View
            </button>

            <button
              class="delete-btn"
              onclick="deleteAnalysis('${analysis._id}')"
            >
              Delete
            </button>

          </div>

        </div>
        `;
    });
  } catch (error) {
    console.error(error);
  }
}

// View Analysis
async function viewAnalysis(id) {
  try {
    const response = await fetch(`${API_URL}/analysis/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    displayAnalysis(data);
  } catch (error) {
    console.error(error);
  }
}

// Delete Analysis
function deleteAnalysis(id) {
  deleteId = id;

  deleteModal.style.display = "flex";
}

confirmDeleteBtn.addEventListener("click", async () => {
  try {
    const response = await fetch(`${API_URL}/analysis/${deleteId}`, {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      loadHistory();
      clearAnalysisDisplay();

      deleteModal.style.display = "none";

      showToast("Analysis Deleted Successfully");
    }
  } catch (error) {
    console.error(error);
  }
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteModal.style.display = "none";
});

function showToast(message) {
  toast.textContent = message;

  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

function clearAnalysisDisplay() {
  document.getElementById("atsScore").textContent = "0%";

  document.getElementById("atsScore").style.color = "#2563eb";

  document.getElementById("progressCircle").style.stroke = "#2563eb";

  document.getElementById("progressCircle").style.strokeDashoffset = 502;

  document.getElementById("matchedSkills").innerHTML = "";

  document.getElementById("missingSkills").innerHTML = "";

  document.getElementById("suggestions").innerHTML = "";
}

document.getElementById("downloadPdfBtn").addEventListener("click", () => {
  if (!currentAnalysis) {
    pdfModal.style.display = "flex";
    return;
  }

  const { jsPDF } = window.jspdf;

  const doc = new jsPDF();
  const logo = document.getElementById("pdfLogo");

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // Header
  // =========================

  doc.setFillColor(37, 99, 235);

  doc.rect(0, 0, 210, 30, "F");

  // Logo

  doc.addImage(logo, "PNG", 10, 5, 18, 18);

  // Title

  doc.setTextColor(255, 255, 255);

  doc.setFontSize(22);

  doc.text("AI Resume Analyzer", 35, 18);

  // =========================
  // User Details
  // =========================

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);

  doc.text(`Candidate Name: ${user.name}`, 15, 40);

  doc.text(`Job Role: ${currentAnalysis.jobRole || "N/A"}`, 15, 48);

  doc.text(`Resume: ${currentAnalysis.fileName || "Resume.pdf"}`, 15, 56);

  doc.text(`Generated On: ${new Date().toLocaleDateString()}`, 15, 64);

  // =========================
  // ATS Score Box
  // =========================

  doc.setFillColor(239, 246, 255);

  doc.roundedRect(130, 35, 55, 35, 3, 3, "F");

  doc.setFontSize(12);

  doc.text("ATS Score", 145, 48);

  doc.setFontSize(20);

  doc.setTextColor(37, 99, 235);

  doc.text(`${currentAnalysis.atsScore}%`, 148, 62);

  // =========================
  // Matched Skills
  // =========================

  let y = 85;

  doc.setFillColor(220, 252, 231);

  doc.roundedRect(15, y, 180, 35, 3, 3, "F");

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(14);

  doc.text("Matched Skills", 20, y + 10);

  doc.setFontSize(11);

  let matchedText = currentAnalysis.matchedSkills.join(", ");

  doc.text(matchedText, 20, y + 22, {
    maxWidth: 165,
  });

  // =========================
  // Missing Skills
  // =========================

  y += 50;

  doc.setFillColor(254, 226, 226);

  doc.roundedRect(15, y, 180, 35, 3, 3, "F");

  doc.setFontSize(14);

  doc.text("Missing Skills", 20, y + 10);

  doc.setFontSize(11);

  let missingText = currentAnalysis.missingSkills.join(", ");

  doc.text(missingText, 20, y + 22, {
    maxWidth: 165,
  });

  // =========================
  // Suggestions
  // =========================

  y += 50;

  doc.setFillColor(239, 246, 255);

  doc.roundedRect(15, y, 180, 55, 3, 3, "F");

  doc.setFontSize(14);

  doc.text("Suggestions", 20, y + 10);

  doc.setFontSize(11);

  let suggestionsText = currentAnalysis.suggestions.join("\n");

  doc.text(suggestionsText, 20, y + 22, {
    maxWidth: 165,
  });

  // =========================
  // Footer
  // =========================

  doc.setFontSize(10);

  doc.setTextColor(120, 120, 120);

  doc.text("Generated by AI Resume Analyzer", 65, 285);

  doc.save("ATS_Report.pdf");
});

pdfModalOkBtn.addEventListener("click", () => {
  pdfModal.style.display = "none";
});

// Initial Load
loadHistory();
