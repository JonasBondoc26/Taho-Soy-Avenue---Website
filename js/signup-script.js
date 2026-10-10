const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");
const signUpToggle = document.getElementById("signUpToggle");
const signInToggle = document.getElementById("signInToggle");
const goToSignUp = document.getElementById("goToSignUp");
const successMessage = document.getElementById("successMessage");
const authTitle = document.getElementById("authTitle");
const authSub = document.getElementById("authSub");

signUpToggle.addEventListener("click", () => {
  signUpForm.classList.add("active-form");
  signUpForm.classList.remove("hidden-form");
  signInForm.classList.add("hidden-form");
  signInForm.classList.remove("active-form");
  signUpToggle.classList.add("active");
  signInToggle.classList.remove("active");
  successMessage.classList.add("hidden-form");

  authTitle.textContent = "Create your account";
  authSub.textContent = "Join TAHO Soy Avenue — it only takes a minute!";
});

signInToggle.addEventListener("click", () => {
  signInForm.classList.add("active-form");
  signInForm.classList.remove("hidden-form");
  signUpForm.classList.add("hidden-form");
  signUpForm.classList.remove("active-form");
  signInToggle.classList.add("active");
  signUpToggle.classList.remove("active");

  authTitle.textContent = "Welcome back!";
  authSub.textContent = "Sign in to your account. Not a member yet? Join TAHO Soy Avenue.";
});

goToSignUp.addEventListener("click", () => {
  signUpToggle.click();
});

// Show / hide password buttons
document.querySelectorAll(".show-pass").forEach(button => {
  button.addEventListener("click", () => {
    const input = button.parentElement.querySelector("input");
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? "Hide" : "Show";
  });
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;

  // Reset form first (its reset handler hides the message)
  signUpForm.reset();

  // Switch to sign-in form, then show success message
  signInToggle.click();
  successMessage.textContent = `Account created successfully! Welcome to the Taho fam, ${firstName}. You can now sign in.`;
  successMessage.classList.remove("hidden-form");

  setTimeout(() => {
    successMessage.classList.add("hidden-form");
  }, 4000);
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signInUsername").value;
  showToast(`Welcome back, ${username}!`);
  signInForm.reset();
});

signUpForm.addEventListener("reset", () => {
  successMessage.classList.add("hidden-form");
});

signInForm.addEventListener("reset", () => {
  successMessage.classList.add("hidden-form");
});
