const signUpForm = document.getElementById("signUpForm");
const signInForm = document.getElementById("signInForm");
const signUpToggle = document.getElementById("signUpToggle");
const signInToggle = document.getElementById("signInToggle");
const goToSignUp = document.getElementById("goToSignUp");
const successMessage = document.getElementById("successMessage");

signUpToggle.addEventListener("click", () => {
  signUpForm.classList.add("active-form");
  signUpForm.classList.remove("hidden-form");
  signInForm.classList.add("hidden-form");
  signInForm.classList.remove("active-form");
  signUpToggle.classList.add("active");
  signInToggle.classList.remove("active");
  successMessage.classList.add("hidden-form");
});

signInToggle.addEventListener("click", () => {
  signInForm.classList.add("active-form");
  signInForm.classList.remove("hidden-form");
  signUpForm.classList.add("hidden-form");
  signUpForm.classList.remove("active-form");
  signInToggle.classList.add("active");
  signUpToggle.classList.remove("active");
  successMessage.classList.add("hidden-form");
});

goToSignUp.addEventListener("click", () => {
  signUpToggle.click();
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(signUpForm);
  
  // Show success message
  successMessage.textContent = "Account Created Successfully!";
  successMessage.classList.remove("hidden-form");
  
  // Reset form
  signUpForm.reset();
  
  // Switch to sign-in form after 2 seconds
  setTimeout(() => {
    successMessage.classList.add("hidden-form");
    signInToggle.click();
  }, 2000);
});

signInForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("signInUsername").value;
  alert(`Welcome back, ${username}!`);
  signInForm.reset();
});

signUpForm.addEventListener("reset", () => {
  successMessage.classList.add("hidden-form");
});

signInForm.addEventListener("reset", () => {
  successMessage.classList.add("hidden-form");
});
