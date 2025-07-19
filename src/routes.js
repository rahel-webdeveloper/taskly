import { atom } from "nanostores";
import Navigo from "navigo";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";
import activeLink from "./navbar.js";
import AIAdviceRender from "./pages/aiAdvice/AIAdviceRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import TaskHubRender from "./pages/taskHub/TaskHubRender.js";
import { navigateTimerPages } from "./pages/timer/TimerLogic.js";
import TimerRender, {
  timerCircleCompo,
  timerPickerCompo,
} from "./pages/timer/TimerRender.js";
import WelcomeRender from "./pages/welcome/WelcomeRender.js";
import TasksListRender from "./tasks/ListTasksRender.js";

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
        renderPage(TaskHubRender);
        if (TaskHubRender.init) {
          TaskHubRender.init();
          TasksListRender.init();
        }
      },

      "/ai-advisor": () => {
        activeLink("/ai-advisor");
        renderPage(AIAdviceRender);
        if (AIAdviceRender.init) AIAdviceRender.init();
      },

      "/dashboard": () => {
        isDashboardOpen.set(true);
        activeLink("/dashboard");
        renderPage(DashboardRender);
        if (TasksListRender.init) {
          DashboardRender.init();
          TasksListRender.init();
        }
      },

      "/timer": () => {
        router.navigate("/timer/picker");
        renderPage(TimerRender);
      },

      "/timer/picker": () => {
        activeLink("/timer");

        renderPage(TimerRender);
        navigateTimerPages(timerPickerCompo);

        if (TimerRender.init) TimerRender.init();
      },

      "/timer/circle": () => {
        activeLink("/timer");

        renderPage(TimerRender);
        navigateTimerPages(timerCircleCompo);

        if (TimerRender.init) TimerRender.init();
      },

      "/welcome": () => {
        activeLink("/welcome");
        renderPage(WelcomeRender);

        if (WelcomeRender.init) WelcomeRender.init();

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

function renderPage(component) {
  const mainContent = document.getElementById("main_content");

  mainContent.innerHTML = component();
}

export default Router;
