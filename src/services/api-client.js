import axios from "axios";
import { loadLocalStorage, removeLocalStorage } from "../data/localStorage";
import { atom } from "nanostores";
import { router } from "../routes";

const token = atom(loadLocalStorage("token") || null);

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

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
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

      removeLocalStorage("token");
      alert("Your session expired. Please log in again.");
      router.navigate("/sing-in");
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
    const res = await axiosInstance.get(`${this.endpoint}/sign-out`);

    return res.data;
  };

  // ------ TASKS

  getTasks = async (queryParams = {}, id) => {
    const res = await axiosInstance.get(`${this.endpoint}/user/${id}`, {
      params: queryParams,
    });

    return res.data;
  };

  getTaskById = async (taskId, userId) => {
    const res = await axiosInstance.get(
      `${this.endpoint}/${taskId}/user/${userId}`
    );

    return res.data;
  };

  createTask = async (newTask) => {
    const res = await axiosInstance.post(this.endpoint, newTask);

    return res.data;
  };

  updateTask = async (taskId, updatedTask) => {
    const res = await axiosInstance.post(
      `${this.endpoint}/${taskId}`,
      updatedTask
    );

    return res.data;
  };

  deleteTask = async (taskId) => {
    const res = await axiosInstance.post(`${this.endpoint}/${taskId}`);

    return res.data;
  };

  // ---------- USERS
  getUserById = async (userId) => {
    const res = await axiosInstance.post(`${this.endpoint}/${userId}`);

    return res.data;
  };
}

export default APIClient;
