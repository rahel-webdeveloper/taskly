import { router } from "../../routes.js";
import APIClient, { token } from "../../services/api-client.js";

const apiClient = new APIClient("auth");

const AuthLogic = () => {
  const email = document.getElementById("signin-email");
  const password = document.getElementById("signin-password");
  const signInForm = document.getElementById("signin-form");
  const signInBtn = document.getElementById("signin-btn");

  signInForm.addEventListener("submit", (e) => {
    e.preventDefault();

    apiClient
      .singIn({ email: email.value, password: password.value })
      .then((res) => {
        console.log(res);

        token.set(res.data.token);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        // useTasks.getUserTasks(res.data.user._id);
      })
      .catch((err) => console.log(err));
  });
};

export default AuthLogic;
