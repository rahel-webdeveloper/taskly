import Navigo from "navigo";
import Home from "./pages/home/Home.js";
import TimerRender from "./pages/timer/TimerRender.js";
import ConstTasksRender from "./pages/tasks/TaskRender.js";
import Dashboard from "./pages/dashboard/Dashboard.js";
import About from "./pages/about/About.js";

const Router = (() => {
  const routes = {
    "/": Home,
    "/timer": TimerRender,
    "/const_tasks": ConstTasksRender,
    "/dashboard": Dashboard,
    "/about": About,
  };

  const mainContent = document.getElementById("main-content");

  const init = () => {
    const router = new Navigo("/", { hash: false });

    // document.addEventListener("click", function (e) {
    //   if (e.target.matches("[data-link]")) {
    //     e.preventDefault();

    //     router.navigate(e.target.getAttribute("href"));
    //   }
    // });

    Object.keys(routes).forEach((route) => {
      router.on(route, () => {
        mainContent.innerHTML = routes[route]();
      });
    });

    router.notFound(() => {
      mainContent.innerHTML = "<h1>404 - Page Not Found";
    });

    router.resolve();
  };

  return { init };
})();

export default Router;
