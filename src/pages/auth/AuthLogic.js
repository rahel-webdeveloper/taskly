import authService from "../../services/auth.service";
import { SignInRender, SignUpRender } from "./AuthRender";

function authEls() {
  const signinEmail = document.getElementById("signin-email");
  const signinPassword = document.getElementById("signin-password");
  const signInForm = document.getElementById("signin-form");
  const signInBtn = document.getElementById("signin-btn");

  const signUpForm = document.getElementById("signup-form");
  const signUpBtn = document.getElementById("signin-btn");

  return { signInForm, signUpForm };
}

const AuthLogic = () => {
  const { signInForm, signUpForm } = authEls();

  signInForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const fd = new FormData(this);

    authService.signIn({
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });

  signUpForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const fd = new FormData(this);

    authService.signUp({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });
};

export const navigateAuthPages = (route) => {
  const authContainer = document.querySelector(".auth");

  if (route === "sign-in") {
    authContainer.innerHTML = SignInRender();
    authContainer.classList.add("auth--signin");
    authContainer.classList.remove("auth--signup");
  }
  if (route === "sign-up") {
    authContainer.innerHTML = SignUpRender();
    authContainer.classList.remove("auth--signin");
    authContainer.classList.add("auth--signup");
  }
};

export default AuthLogic;
