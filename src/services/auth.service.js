import { atom } from "nanostores";
import { showProfile, showSidebar } from "../navbar";
import { liveTrackTasks } from "../pages/taskHub/TaskHubLogic";
import { router } from "../routes";
import { tasks } from "../tasks/store";
import { controlTasksAllOperation } from "../tasks/tasksLogic";
import APIClient from "./api-client";
import APIErrorController from "./data.error.controller";

export const userId = atom(localStorage.getItem("userId") || null);
export const token = atom(localStorage.getItem("tasklyToken") || null);
export const userData = atom(null);

const apiClientAuth = new APIClient("auth");
const apiClientUsers = new APIClient("users");
const apiClientTasks = new APIClient("tasks");

class AuthService {
  isAuthenticated = (token) => !!token;

  signIn(data) {
    apiClientAuth
      .singIn({ email: data.email, password: data.password })
      .then((res) => {
        token.set(res.data.token);
        userId.set(res.data.user._id);
        this.controlleLogged(res.data.user._id);

        localStorage.setItem("tasklyToken", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        router.navigate("/");

        apiClientTasks.getTasks(res.data.user._id).then((res) => {
          tasks.set(res.tasks);

          controlTasksAllOperation();
          liveTrackTasks();
        });
      })
      .catch((err) => APIErrorController(err));
  }

  signUp(data) {
    apiClientAuth
      .signUp({ name: data.name, email: data.email, password: data.password })
      .then((res) => {
        token.set(res.data.token);
        userId.set(res.data.user._id);
        this.controlleLogged(res.data.user._id);

        localStorage.setItem("tasklyToken", res.data.token);
        localStorage.setItem("userId", res.data.user._id);

        router.navigate("/");
      })
      .catch((err) => APIErrorController(err));
  }

  controlleLogged(userId) {
    apiClientUsers
      .getUserById(userId)
      .then((res) => {
        userData.set(res.user);

        showSidebar(true);
        showProfile(true);
      })
      .catch((err) => {
        if (localStorage.getItem("userId")) APIErrorController(err);

        showSidebar(false);
        showProfile(false);
      });
  }

  signOut() {
    localStorage.removeItem("tasklyToken");
    userData.set(null);

    showSidebar(false);
    showProfile(false);
  }
}

export default new AuthService();
