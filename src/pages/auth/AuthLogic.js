import authService from "../../services/auth.service";

function authEls() {
  const signinEmail = document.getElementById("signin-email");
  const signinPassword = document.getElementById("signin-password");
  const signInForm = document.getElementById("signin-form");
  const signInBtn = document.getElementById("signin-btn");

  // const signinEmail = document.getElementById("signin-email");
  // const signinPassword = document.getElementById("signin-password");
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

export default AuthLogic;
