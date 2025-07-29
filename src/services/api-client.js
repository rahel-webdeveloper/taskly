import axios from "axios";
import { atom } from "nanostores";
import { router } from "../routes";

export const token = atom(localStorage.getItem("token") || null);

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

      localStorage.removeItem("token");
      // alert("Your session expired. Please log in again.");
      router.navigate("/auth/sign-in");
    }
    return Promise.reject(err);
  }
);

class APIClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // ------ Auth

  signUp = async (data) => {
    const res = await axiosInstance.post(`${this.endpoint}/sign-up`, data);

    return res.data;
  };

  singIn = async (data) => {
    const response = await axiosInstance.post(`${this.endpoint}/sign-in`, data);

    return response.data;
  };

  signOut = async () => {
    const res = await axiosInstance.get(`/${this.endpoint}/sign-out`);

    return res.data;
  };

  // ------ TASKS

  getTasks = async (userId) => {
    const res = await axiosInstance.get(`/${this.endpoint}/user/${userId}`);

    return res.data;
  };

  getTaskById = async (taskId) => {
    const res = await axiosInstance.get(`/${this.endpoint}/${taskId}`);

    return res.data;
  };

  createTask = async (newTask) => {
    const res = await axiosInstance.post(`/${this.endpoint}`, newTask);

    return res.data;
  };

  updateTask = async (taskId, updatedTask) => {
    const res = await axiosInstance.post(
      `/${this.endpoint}/${taskId}`,
      updatedTask
    );

    return res.data;
  };

  deleteTask = async (taskId) => {
    const res = await axiosInstance.post(`/${this.endpoint}/${taskId}`);

    return res.data;
  };

  // ---------- USERS
  getUsers = async () => {
    const res = await axiosInstance.get(`/${this.endpoint}`);

    return res.data;
  };

  getUserById = async (userId) => {
    const res = await axiosInstance.get(`/${this.endpoint}/${userId}`);

    return res.data;
  };
}

export default APIClient;
