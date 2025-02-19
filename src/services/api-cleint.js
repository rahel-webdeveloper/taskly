import axios from "axios";
import { updateViewOnTask } from "../pages/tasks/TaskLogic";
import { listTask } from "../App";

class APIClient {
  constructor() {
    this.API_URL = "http://localhost:3000/tasks";
  }

  getTasks() {
    axios
      .get(this.API_URL)
      .then((res) => {
        listTask.set(res.data);
        updateViewOnTask();
      })
      .catch((err) => console.log(err));
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
