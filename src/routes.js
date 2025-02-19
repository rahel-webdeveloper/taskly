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

  const init = () => {
    const router = new Navigo("/", {
      linksSelector: "[data-navigo]",
      hash: true,
    });

    router.on("/", () => {
      mainContent.innerHTML = Home();
    });

    router.on("/ai-advice", () => {
      mainContent.innerHTML = `<h1>AI Advice</h1>`;
      activeLink("/ai-advice");
    });

    router
      .on("/timer", () => {
        mainContent.innerHTML = TimerRender();
        activeLink("/timer");
      })

      .on("/tasks", async () => {
        mainContent.innerHTML = ConstTasksRender();
        activeLink("/tasks");
        router.updatePageLinks();
      })

      .on("/dashboard", () => {
        isDashboardOpen.set(true);
        mainContent.innerHTML = DashboardRender();
        activeLink("/dashboard");
      })

      .on("/about", () => {
        mainContent.innerHTML = About();
        activeLink("/about");
      })

      .notFound(() => {
        mainContent.innerHTML = "<h1>404 - Page Not Found";
      });

    router.resolve();
  };

  return { init };
})();

export default Router;
