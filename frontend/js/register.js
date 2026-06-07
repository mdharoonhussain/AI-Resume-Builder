const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.success) {
      message.style.color = "green";

      message.textContent = "Registration Successful!";

      setTimeout(() => {
        window.location.href = "./login.html";
      }, 1500);
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
