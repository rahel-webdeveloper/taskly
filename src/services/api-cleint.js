import axios from "axios";
import { updateViewOnTask } from "../pages/tasks/TaskLogic";
import { listTask } from "../App";

export const fetchTasks = async () => {
  fetch("/tasks.json")
    .then((res) => res.json())
    .then((data) => {
      listTask.set(data);
      updateViewOnTask();
    });
};

class APIClient {
  constructor() {
    this.API_URL = "https://json-server-api-89nr.onrender.com";
  }
  getTasks() {
    axios
      .get("../data/ListTasks.json")
      .then((res) => {
        // listTask.set(res.data.tasks);
        updateViewOnTask();
      })
      .catch((err) => console.log(err.message));
  }

  createTask(task) {
    axios
      .post(this.API_URL, task)
      .then((res) => {
        res.data;
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  updateTask(id, updatedTask) {
    axios
      .put(`${this.API_URL}/${id}`, updatedTask)
      .then((res) => {
        listTask.set(res.data);
        updateViewOnTask();
      })
      .catch((err) => console.log(err.message));
  }

  deleteTask(id) {
    this.API_URL.delete(`${this.API_URL}/${id}`)
      .then((res) => {
        // listTask.set(res.data);
        // updateViewOnTask();
      })
      .catch((err) => console.log(err));
  }
}

export default APIClient;
