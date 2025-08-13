import authService from "../../services/auth.service";
import { DeleteAccountRender, SignInRender, SignUpRender } from "./AuthRender";

export function authEls() {
  const signinEmail = document.getElementById("signin-email");
  const signinPassword = document.getElementById("signin-password");
  const signInForm = document.getElementById("signin-form");
  const signInBtn = document.getElementById("signin-btn");

  const signUpForm = document.getElementById("signup-form");
  const signUpBtn = document.getElementById("signup-btn");
  const signupPassword = document.getElementById("signup-password");

  return {
    signInForm,
    signUpForm,
    signinPassword,
    signupPassword,
    signInBtn,
    signUpBtn,
  };
}

const AuthLogic = () => {
  const {
    signInForm,
    signUpForm,
    signinPassword,
    signupPassword,
    signInBtn,
    signUpBtn,
  } = authEls();

  signInForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    signInBtn.textContent = "Signing In...";
    signInBtn.disabled = true;

    const fd = new FormData(this);

    authService.signIn({
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });

  signUpForm?.addEventListener("submit", function (e) {
    e.preventDefault();
    signUpBtn.textContent = "Signing Up...";
    signUpBtn.disabled = true;

    const fd = new FormData(this);

    authService.signUp({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.closest(".signin-p")) showPassword(signinPassword, target);

    if (target.closest(".signup-p")) showPassword(signupPassword, target);
  });
};

function showPassword(input, targetEle) {
  if (input) {
    input.type = input.type === "password" ? "text" : "password";

    targetEle.classList.toggle("bi-eye-slash");
    targetEle.classList.toggle("bi-eye");
  }
}

export const navigateAuthPages = (route) => {
  const authContainer = document.querySelector(".auth");

  if (route === "sign-in") {
    authContainer.innerHTML = SignInRender();
    authContainer.classList.remove("auth--remove-account");
    authContainer.classList.remove("auth--signup");
    authContainer.classList.add("auth--signin");
  }

  if (route === "sign-up") {
    authContainer.innerHTML = SignUpRender();
    authContainer.classList.remove("auth--remove-account");
    authContainer.classList.remove("auth--signin");
    authContainer.classList.add("auth--signup");
  }

  if (route === "remove-account") {
    authContainer.innerHTML = DeleteAccountRender();
    authContainer.classList.remove("auth--signin");
    authContainer.classList.remove("auth--signup");
    authContainer.classList.add("auth--remove-account");
  }
};

export default AuthLogic;
