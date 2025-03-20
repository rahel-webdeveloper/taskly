import Router from "../../routes.js";
import TasksLogic from "./TaskLogic.js";

const MainTasks = () => {
  document.addEventListener("DOMContentLoaded", () => {
    TasksLogic();
    setTimeout(() => Router.router.updatePageLinks(), 1500);
  });
};

export default MainTasks;
