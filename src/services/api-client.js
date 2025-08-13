import axios from "axios";
import { currentRoute, isWelcomePageSeen, router } from "../routes";
import { token, userId } from "./auth.service";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------ Attach Token Before Every Request
axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = token.get();

    if (authToken) config.headers["Authorization"] = `Bearer ${authToken}`;

    return config;
  },
  (err) => Promise.reject(err)
);

// ------ Handle Auth Errors Globally

axiosInstance.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response && [401, 403].includes(err.response.status)) {
      token.set(null);

      localStorage.removeItem("tasklyToken");

      if (isWelcomePageSeen.get() && userId.get())
        currentRoute.get() === "auth/sign-in" || userId.get()
          ? router.navigate("/auth/sign-in")
          : router.navigate("/auth/sign-up");
    }
    return Promise.reject(err);
  }
);

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // ------ Auth

  async signUp(data) {
    const res = await axiosInstance.post(`${this.endpoint}/sign-up`, data);

    return res.data;
  }

  async singIn(data) {
    const response = await axiosInstance.post(`${this.endpoint}/sign-in`, data);

    return response.data;
  }

  async signOut() {
    const res = await axiosInstance.get(`/${this.endpoint}/sign-out`);

    return res.data;
  }

  async removeAccount(data) {
    const res = await axiosInstance.post(
      `/${this.endpoint}/remove-account`,
      data
    );

    return res.data;
  }

  // ------ TASKS

  async getTasks(userId) {
    const res = await axiosInstance.get(`/${this.endpoint}/user/${userId}`);

    return res.data;
  }

  async getTaskById(taskId) {
    const res = await axiosInstance.get(`/${this.endpoint}/${taskId}`);

    return res.data;
  }

  async createTask(newTask) {
    const res = await axiosInstance.post(`/${this.endpoint}`, newTask);

    return res.data;
  }

  async updateTask(taskId, updatedTask) {
    const res = await axiosInstance.put(
      `/${this.endpoint}/${taskId}`,
      updatedTask
    );

    return res.data;
  }

  async deleteTask(taskId) {
    const res = await axiosInstance.delete(`/${this.endpoint}/${taskId}`);

    return res.data;
  }

  async deleteTasks() {
    const res = await axiosInstance.delete(`/${this.endpoint}`);

    return res.data;
  }

  // ---------- USERS
  async getUsers() {
    const res = await axiosInstance.get(`/${this.endpoint}`);

    return res.data;
  }

  async getUserById(userId) {
    const res = await axiosInstance.get(`/${this.endpoint}/${userId}`);

    return res.data;
  }
}

export default APIClient;
