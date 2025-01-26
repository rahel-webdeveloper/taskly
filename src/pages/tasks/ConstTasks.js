import constTasksLogic, { loadTasksFromStorage } from "./TaskLogic.js";

export let listTask = loadTasksFromStorage() || [];

const ConstTasks = () => {
  document.addEventListener("DOMContentLoaded", () => {
    constTasksLogic();
  });
};

export default ConstTasks;

export function deleteAll() {
  return (listTask = listTask.filter((task) => task.state !== "complete"));
}
