import DashboardLogic from "./DashboardLogic";
import { listTask } from "../../App";
import { atom } from "nanostores";
import { updateViewOnTask } from "../tasks/TaskLogic";

export const isDashboardOpen = atom(false);

const MainDashboard = () => {
  document.addEventListener("DOMContentLoaded", function () {
    if (isDashboardOpen.get()) DashboardLogic();
  });
};

export default MainDashboard;
