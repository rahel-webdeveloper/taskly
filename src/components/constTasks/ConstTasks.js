import { loadTasksFromStorage, ConstTasksLogic } from "./TaskLogic.js";

export let listTask = loadTasksFromStorage() || [];

const ConstTasks = () => {
  document.addEventListener("DOMContentLoaded", () => {
    ConstTasksLogic();
  });
};

export default ConstTasks;

export function deleteAll() {
  return (listTask = listTask.filter((task) => task.state !== "complete"));
}
