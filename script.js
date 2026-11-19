const loginView = document.querySelector("#login-view");
const signupView = document.querySelector("#signup-view");
const message = document.querySelector("#form-message");

function showView(view) {
  const isSignup = view === "signup";
  loginView.hidden = isSignup;
  signupView.hidden = !isSignup;
  message.textContent = "";
}

document.querySelectorAll("[data-switch]").forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.switch));
});

document.querySelectorAll("[data-password]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.password);
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    button.setAttribute("aria-label", isVisible ? "Show password" : "Hide password");
  });
});

document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const username=document.querySelector("#login-email").value;
  const password=document.querySelector("#login-password").value;

  const response = await fetch("http://127.0.0.1:8000/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  });

  const data = await response.json();
  if (response.ok){
    localStorage.setItem("user", JSON.stringify(data))
    window.location.href="home.html"
  } else {
    message.textContent=data.detail;
  }
});

document.querySelector("#signup-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.querySelector("#signup-name").value;
  const username = document.querySelector("#signup-email").value;
  const password = document.querySelector("#signup-password").value;
  const confirmation = document.querySelector("#confirm-password").value;

  if (password !== confirmation) {
    message.textContent = "Those passwords don't match yet.";
    document.querySelector("#confirm-password").focus();
    return;
  }

  const response = await fetch("http://127.0.0.1:8000/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name,username, password})
  });

  const data = await response.json();
  if (response.ok){
    localStorage.setItem("user", JSON.stringify(data))
    window.location.href="home.html"
  } else {
    message.textContent = data.detail;
  }
  });