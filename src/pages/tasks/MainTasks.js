import Router from "../../routes.js";
import TasksLogic from "./TaskLogic.js";

const MainTasks = () => {
  document.addEventListener("DOMContentLoaded", () => {
    TasksLogic();
  });
};

export default MainTasks;
