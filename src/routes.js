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
import TaskHubLogic from "./pages/task_hub/TaskHubLogic.js";
import AIAdviceLogic from "./pages/ai_advice/AIAdviceLogic.js";
import DashboardLogic from "./pages/dashboard/DashboardLogic.js";
import timerLogic from "./pages/timer/TimerLogic.js";
import WelcomeLogic from "./pages/welcome/WelcomeLogic.js";

const router = new Navigo("/", {
  linksSelector: "[data-link]",
  hash: false,
});

const Router = () => {
  const isWelcomePageSeen = atom(loadLocalStorage("is_welcome_seen") || false);

  router
    .on({
      "/": () => {
        activeLink("/");
        renderPage(TaskHubRender, TaskHubLogic);
      },

      "/ai-advisor": () => {
        activeLink("/ai-advisor");
        renderPage(AIAdviceRender, AIAdviceLogic);
      },

      "/dashboard": () => {
        isDashboardOpen.set(true);
        activeLink("/dashboard");
        renderPage(DashboardRender, DashboardLogic);
      },

      "/timer": () => {
        activeLink("/timer");
        renderPage(TimerRender, timerLogic);
      },

      "/welcome": () => {
        activeLink("/welcome");
        renderPage(WelcomeRender, WelcomeLogic);

        isWelcomePageSeen.set(true);
        saveLocalStorage(isWelcomePageSeen.get(), "is_welcome_seen");
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

function renderPage(component, logic) {
  const mainContent = document.getElementById("main_content");

  if (document.startViewTransition) {
    // document.startViewTransition(() => {
    mainContent.innerHTML = component();
    // });
  } else {
    mainContent.innerHTML = component();
  }
}

export default Router;
