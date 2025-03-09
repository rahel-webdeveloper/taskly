import ListTasksLogic from "./ListTasksLogic";
import TasksRender from "./ListTasksRender";

const ListTaskMain = () => {
  document.addEventListener("DOMContentLoaded", function () {
    ListTasksLogic();
    TasksRender();
  });
};

export default ListTaskMain;
