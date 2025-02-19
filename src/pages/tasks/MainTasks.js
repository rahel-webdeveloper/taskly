import { listTask } from "../../App.js";
import constTasksLogic from "./TaskLogic.js";

const MainTasks = () => {
  document.addEventListener("DOMContentLoaded", () => {
    constTasksLogic();
  });
};

export default MainTasks;
