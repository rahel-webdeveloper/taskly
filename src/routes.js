import { atom } from "nanostores";
import Navigo from "navigo";
import loadingDivComp from "./components/Loading.js";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";
import activeLink from "./navbar.js";
import AIAdviceRender from "./pages/aiAdvice/AIAdviceRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import TaskHubRender from "./pages/taskHub/TaskHubRender.js";
import { navigateTimerPages } from "./pages/timer/TimerLogic.js";
import TimerRender from "./pages/timer/TimerRender.js";
import WelcomeRender from "./pages/welcome/WelcomeRender.js";
import TasksListRender from "./tasks/tasksRender.js";

export const isDashboardOpen = atom(false);
const currentRoute = atom(null);
const isWelcomePageSeen = atom(loadLocalStorage("is_welcome_seen") || false);

const mainContentEl = document.getElementById("main_content");

export const router = new Navigo("/", {
  // linksSelector: "[data-link]",
  hash: false,
});

const Router = () => {
  router
    .on({
      "/welcome": () => {
        activeLink("/welcome");
        renderPage(WelcomeRender, { data: null });

        isWelcomePageSeen.set(true);
        saveLocalStorage(isWelcomePageSeen.get(), "is_welcome_seen");
      },

      "/": () => {
        isDashboardOpen.set(false);
        activeLink("/");
        renderPage(TaskHubRender, TasksListRender);
      },

      "/ai-advisor": () => {
        activeLink("/ai-advisor");
        renderPage(AIAdviceRender, { data: null });
      },

      "/dashboard": () => {
        isDashboardOpen.set(true);
        activeLink("/dashboard");
        renderPage(DashboardRender, TasksListRender);
      },

      "/timer": () => router.navigate("/timer/picker"),

      // Dynamic Route for timer
      "/timer/:mode?": ({ data }) => {
        activeLink("/timer");
        data.route = "dynamic";
        renderPage(TimerRender, data);
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

router.hooks({
  before(done, match) {
    mainContentEl.innerHTML = loadingDivComp();

    currentRoute.set(match.url);

    done();
  },

  after(match) {
    // console.log(match);
  },

  leave(done, match) {
    document.startViewTransition
      ? document.startViewTransition(() => done())
      : done();
  },
});

function renderPage(component, additionalInit) {
  mainContentEl.innerHTML = component();

  if (additionalInit.route === "dynamic") renderDynamicPages(additionalInit);

  component?.init();
  if (additionalInit.init) additionalInit?.init();
}

const renderDynamicPages = (data) => {
  if (isRouteInTimer()) navigateTimerPages(data.mode);

  // else other dyanamic routing
};

const isRouteInTimer = () =>
  currentRoute.get().slice(0, 5) === "timer" ? true : false;

export default Router;
