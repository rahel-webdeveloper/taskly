import { atom } from "nanostores";
import Navigo from "navigo";
import loadingDivComp from "./components/Loading.js";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";
import activeLink from "./navbar.js";
import AIAdviceRender from "./pages/aiAdvice/AIAdviceRender.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import TaskHubRender from "./pages/taskHub/TaskHubRender.js";
import { navigateTimerPages } from "./pages/timer/store.js";
import TimerRender from "./pages/timer/TimerRender.js";
import WelcomeRender from "./pages/welcome/WelcomeRender.js";
import renderTasksList from "./tasks/tasksRender.js";
import AuthRender from "./pages/auth/AuthRender.js";
import authService, { token } from "./services/auth.service.js";
import { navigateAuthPages } from "./pages/auth/AuthLogic.js";

const mainContentEl = document.getElementById("main_content");

export const isWelcomePageSeen = atom(
  loadLocalStorage("is_welcome_seen") || false
);
export const currentRoute = atom(null);
export const isDashboardOpen = atom(false);

export const router = new Navigo("/", {
  // linksSelector: "[data-link]",
  hash: false,
});

const Router = () => {
  router
    .on({
      "/welcome": {
        uses: () => {
          activeLink("/welcome");
          renderPage(WelcomeRender, { data: null });

          isWelcomePageSeen.set(true);
          saveLocalStorage(isWelcomePageSeen.get(), "is_welcome_seen");
        },
        hooks: {
          leave: viewTransition,
        },
      },

      "/auth": {
        uses: () => router.navigate("/auth/sign-in"),
      },
      "/auth/:mode?": {
        uses: ({ data }) => {
          activeLink("");
          data.route = "dynamic";
          renderPage(AuthRender, data);
        },
        hooks: {
          before: setCurrentRoute,
          leave: viewTransition,
        },
      },

      "/": {
        uses: () => {
          isDashboardOpen.set(false);
          activeLink("/");
          renderPage(TaskHubRender, renderTasksList);
        },
        hooks: {
          before: requireAuth,
          leave: viewTransition,
        },
      },

      "/ai-advisor": {
        uses: () => {
          activeLink("/ai-advisor");
          renderPage(AIAdviceRender, { data: null });
        },
        hooks: {
          before: requireAuth,
          leave: viewTransition,
        },
      },

      "/dashboard": {
        uses: () => {
          isDashboardOpen.set(true);
          activeLink("/dashboard");
          renderPage(DashboardRender, renderTasksList);
        },

        hooks: {
          before: requireAuth,
          leave: viewTransition,
        },
      },

      "/timer": {
        uses: () => router.navigate("/timer/picker"),
        hooks: {
          before: requireAuth,
          leave: viewTransition,
        },
      },

      // Dynamic Route for timer
      "/timer/:mode?": {
        uses: ({ data }) => {
          activeLink("/timer");
          data.route = "dynamic";
          renderPage(TimerRender, data);
        },
        hooks: {
          before: requireAuth,
          leave: viewTransition,
        },
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

// Route Gaurds
const requireAuth = (done, match) => {
  mainContentEl.innerHTML = loadingDivComp();
  setCurrentRoute(done, match);

  if (authService.isAuthenticated(token.get())) done();
  else {
    router.navigate("/auth/sign-in");
    done();
  }
};

const setCurrentRoute = (done, match) => {
  currentRoute.set(match.url);
  done();
};

const viewTransition = (done, match) =>
  document.startViewTransition
    ? document.startViewTransition(() => done())
    : done();

function renderPage(component, additionalInit) {
  mainContentEl.innerHTML = component();

  if (additionalInit.route === "dynamic") renderDynamicPages(additionalInit);

  if (component.init) component?.init();
  if (additionalInit.init) additionalInit?.init();
}

const renderDynamicPages = (data) => {
  if (isRouteInTimer()) navigateTimerPages(data.mode);

  if (isRouteInAuth()) navigateAuthPages(data.mode);

  // else other dyanamic routing
};

const isRouteInTimer = () =>
  currentRoute.get().slice(0, 5) === "timer" ? true : false;

const isRouteInAuth = () =>
  currentRoute.get().slice(0, 4) === "auth" ? true : false;

export default Router;
