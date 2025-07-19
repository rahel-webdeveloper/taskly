import { atom } from "nanostores";
import Navigo from "navigo";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";
import activeLink from "./navbar.js";
import AIAdviceRender from "./pages/ai_advice/AIAdviceRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import TaskHubRender from "./pages/task_hub/TaskHubRender.js";
import TimerRender, {
  timerCircleCompo,
  timerPickerCompo,
} from "./pages/timer/TimerRender.js";
import WelcomeRender from "./pages/welcome/WelcomeRender.js";
import DashboardLogic from "./pages/dashboard/DashboardLogic.js";
import WelcomeLogic from "./pages/welcome/WelcomeLogic.js";
import TasksListRender from "./tasks/ListTasksRender.js";
import { navigateTimerPages } from "./pages/timer/TimerLogic.js";

export const isDashboardOpen = atom(false);

const isWelcomePageSeen = atom(loadLocalStorage("is_welcome_seen") || false);

const mainContentEl = document.getElementById("main_content");

export const router = new Navigo("/", {
  // linksSelector: "[data-link]",
  hash: false,
});

const Router = () => {
  router
    .on({
      "/": () => {
        isDashboardOpen.set(false);
        activeLink("/");
        renderPage(TaskHubRender, null);
        if (TaskHubRender.init) {
          TaskHubRender.init();
          TasksListRender.init();
        }
      },

      "/ai-advisor": () => {
        activeLink("/ai-advisor");
        renderPage(AIAdviceRender, null);
        if (AIAdviceRender.init) AIAdviceRender.init();
      },

      "/dashboard": () => {
        isDashboardOpen.set(true);
        activeLink("/dashboard");
        renderPage(DashboardRender, DashboardLogic);
        if (TasksListRender.init) TasksListRender.init();
      },

      "/timer": () => {
        router.navigate("/timer/picker");
        renderPage(TimerRender, null);
      },

      "/timer/picker": () => {
        activeLink("/timer");

        renderPage(TimerRender, null);
        navigateTimerPages(timerPickerCompo);

        if (TimerRender.init) TimerRender.init();
      },

      "/timer/circle": () => {
        activeLink("/timer");

        renderPage(TimerRender, null);
        navigateTimerPages(timerCircleCompo);

        if (TimerRender.init) TimerRender.init();
      },

      "/welcome": () => {
        activeLink("/welcome");
        renderPage(WelcomeRender, WelcomeLogic);

        isWelcomePageSeen.set(true);
        saveLocalStorage(isWelcomePageSeen.get(), "is_welcome_seen");
      },
    })

    .notFound(() => {
      mainContentEl.innerHTML = "<h1>404 - Page Not Found</h1>";
    })

    .resolve();

  router.updatePageLinks();

  if (!isWelcomePageSeen.get()) router.navigate("/welcome");

  return { router };
};

function renderPage(component, logic) {
  const mainContent = document.getElementById("main_content");

  if (document.startViewTransition) {
    mainContent.innerHTML = component();
    if (logic) logic();
  } else {
    mainContent.innerHTML = component();
  }
}

export default Router;
