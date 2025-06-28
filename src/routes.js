import { atom } from "nanostores";
import Navigo from "navigo";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";
import activeLink from "./navbar.js";
import AIAdviceRender from "./pages/ai_advice/AIAdviceRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import { isDashboardOpen } from "./pages/dashboard/MainDashboard.js";
import TaskHubRender from "./pages/task_hub/TaskHubRender.js";
import TimerRender from "./pages/timer/TimerRender.js";
import WelcomeRender from "./pages/welcome/WelcomeRender.js";

const Router = () => {
  const router = new Navigo("/", {
    linksSelector: "[data-link]",
    hash: false,
  });

  const mainContent = document.getElementById("main_content");

  const isWelcomePageSeen = atom(loadLocalStorage("is_about_seen") || false);

  router
    .on({
      "/": () => {
        mainContent.innerHTML = TaskHubRender();
        activeLink("/");
      },

      "/ai-advisor": () => {
        mainContent.innerHTML = AIAdviceRender();
        activeLink("/ai-advisor");
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

      "/welcome": () => {
        mainContent.innerHTML = WelcomeRender();
        activeLink("/welcome");

        isWelcomePageSeen.set(true);
        saveLocalStorage(isWelcomePageSeen.get(), "is_about_seen");
      },
    })

    .notFound(() => {
      mainContent.innerHTML = "<h1>404 - Page Not Found</h1>";
    })

    .resolve();

  router.updatePageLinks();

  if (!isWelcomePageSeen.get()) router.navigate("/welcome");

  return { router };
};

export default Router;
