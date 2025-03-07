import DashboardLogic from "./DashboardLogic";
import { listTask } from "../../App";
import { atom } from "nanostores";
import { addTaskToHtml } from "../tasks/TaskRender";

export const isDashboardOpen = atom(false);

const MainDashboard = () => {
  document.addEventListener("DOMContentLoaded", function () {
    if (isDashboardOpen.get()) DashboardLogic();
    addTaskToHtml(listTask.get());
  });
};

export default MainDashboard;
