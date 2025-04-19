import Navigo from "navigo";
import activeLink from "./navbar.js";
import Welcome from "./pages/welcome/Welcome.js";
import DashboardRender from "./pages/dashboard/DashboardRender.js";
import { isDashboardOpen } from "./pages/dashboard/MainDashboard.js";
import TimerRender from "./pages/timer/TimerRender.js";
import { atom } from "nanostores";
import TaskHubRender from "./pages/task_hub/TaskHubRender.js";
import { loadLocalStorage, saveLocalStorage } from "./data/localStorage.js";

const Router = (() => {
  const mainContent = document.getElementById("main-content");

  const isAboutSeen = atom(loadLocalStorage("is_about_seen") || false);

  const router = new Navigo("/", {
    linksSelector: "[data-link]",
    hash: false,
  });

  const init = () => {
    router
      .on({
        "/": () => {
          mainContent.innerHTML = TaskHubRender();
          activeLink("/");
        },

        "/ai-advice": () => {
          mainContent.innerHTML = `<h1>AI Advice</h1>`;
          activeLink("/ai-advice");
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
          mainContent.innerHTML = Welcome();
          activeLink("/about");

          isAboutSeen.set(true);
          saveLocalStorage(isAboutSeen.get(), "is_about_seen");
        },
      })

      .notFound(() => {
        mainContent.innerHTML = "<h1>404 - Page Not Found</h1>";
      })

      .resolve();

    router.updatePageLinks();
  };

  if (!isAboutSeen.get()) router.navigate("/about");

  return { init, router };
})();

export default Router;
