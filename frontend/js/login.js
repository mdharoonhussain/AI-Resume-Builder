console.log("login.js loaded");

const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  console.log("Login attempt:", { email, password });

  try {
    const response = await fetch(
      "https://ai-resume-analyzer-iw0l.onrender.com/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      },
    );

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      message.style.color = "green";

      message.textContent = "Login Successful";

      setTimeout(() => {
        window.location.href = "./dashboard.html";
      }, 1000);
    } else {
      message.style.color = "red";

      message.textContent = data.message;
    }
  } catch (error) {
    message.style.color = "red";

    message.textContent = "Something went wrong";
  }
});

const togglePassword = document.getElementById("togglePassword");

const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglePassword.textContent = "🙈";
  } else {
    passwordInput.type = "password";
    togglePassword.textContent = "👁️";
  }
});
