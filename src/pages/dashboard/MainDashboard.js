import DashboardLogic from "./DashboardLogic";
import { atom } from "nanostores";

export const isDashboardOpen = atom(false);

const MainDashboard = () => {
  document.addEventListener("DOMContentLoaded", function () {
    if (isDashboardOpen.get()) DashboardLogic();
  });
};

export default MainDashboard;
