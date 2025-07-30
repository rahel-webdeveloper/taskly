import { showProfile, showSidebar } from "../../navbar.js";
import { router } from "../../routes.js";
import APIClient from "../../services/api-client.js";
import { token, userData } from "./store.js";

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

    authServices.signIn({
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });

  signUpForm?.addEventListener("submit", function (e) {
    e.preventDefault();

    const fd = new FormData(this);

    authServices.signUp({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
  });
};

const apiClientAuth = new APIClient("auth");
const apiClientUsers = new APIClient("users");
const apiClientTasks = new APIClient("tasks");

class AuthServices {
  isLogged = (token) => !!token;

  signIn(data) {
    apiClientAuth
      .singIn({ email: data.email, password: data.password })
      .then((res) => {
        console.log(res);

        token.set(res.data.token);
        this.controlleLogged(res.data.user._id);

        localStorage.setItem("tasklyToken", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        router.navigate("/");

        apiClientTasks
          .getTasks(res.data.user._id)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  signUp(data) {
    apiClientAuth
      .signUp({ name: data.name, email: data.email, password: data.password })
      .then((res) => {
        console.log(res);

        token.set(res.data.token);
        this.controlleLogged(res.data.user._id);

        localStorage.setItem("tasklyToken", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        router.navigate("/");

        apiClientTasks
          .getTasks(res.data.user._id)
          .then((res) => console.log(res))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  controlleLogged(userId) {
    apiClientUsers
      .getUserById(userId)
      .then((res) => {
        userData.set(res.user);

        // console.log(res);
        showSidebar(true);
        showProfile(true);
      })
      .catch((err) => {
        console.log(err);

        showSidebar(false);
        showProfile(false);
      });
  }

  signOut() {
    localStorage.removeItem("tasklyToken");
    userData.set(null);
    router?.navigate("/auth/sign-in");

    showSidebar(false);
    showProfile(false);
  }
}

export const authServices = new AuthServices();

export default AuthLogic;
