import Navigo from "navigo";
import Home from "./pages/home/Home.js";
import TimerRender from "./pages/timer/TimerRender.js";
import ConstTasksRender from "./pages/tasks/TaskRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import About from "./pages/about/About.js";
import activeLink from "./navbar.js";
import { isDashboardOpen } from "./pages/dashboard/MainDashboard.js";

const Router = (() => {
  const mainContent = document.getElementById("main-content");

  const router = new Navigo("/", {
    linksSelector: "[data-link]",
    hash: false,
  });

  const init = () => {
    router
      .on({
        "/": () => (mainContent.innerHTML = Home()),

        "/ai-advice": () => {
          mainContent.innerHTML = `<h1>AI Advice</h1>`;
          activeLink("/ai-advice");
        },

        "/tasks": async () => {
          mainContent.innerHTML = ConstTasksRender();
          activeLink("/tasks");
        },

        "/dashboard": () => {
          isDashboardOpen.set(true);
          mainContent.innerHTML = DashboardRender();
          activeLink("/dashboard");
        },

        "/timer": () => {
          mainContent.innerHTML = TimerRender();
          activeLink("/timer");
        },

        "/about": () => {
          mainContent.innerHTML = About();
          activeLink("/about");
        },
      })

      .notFound(() => {
        mainContent.innerHTML = "<h1>404 - Page Not Found</h1>";
      })

      .resolve();
  };

  return { init, router };
})();

export default Router;
