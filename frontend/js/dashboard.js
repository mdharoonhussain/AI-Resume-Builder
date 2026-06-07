const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

const deleteModal = document.getElementById("deleteModal");

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

const toast = document.getElementById("toast");

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

  const formData = new FormData();

  formData.append("resume", file);
  formData.append("jobRole", jobRole);

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
  document.getElementById("atsScore").textContent = `${data.atsScore}%`;

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
  document.getElementById("atsScore").textContent = "--";

  document.getElementById("matchedSkills").innerHTML = "";

  document.getElementById("missingSkills").innerHTML = "";

  document.getElementById("suggestions").innerHTML = "";
}

// Initial Load
loadHistory();
