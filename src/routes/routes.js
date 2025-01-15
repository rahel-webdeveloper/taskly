import TimerRender from "../components/timer/TimerRender.js";
import ConstTasksRender from "../components/constTasks/TaskRender.js";
import Dashboard from "../components/dashboard/Dashboard.js";
import About from "../components/about/About.js";
import Navigo from "navigo";

const Router = (() => {
  const routes = {
    "/": () => "<h1> Home Page</h1>",
    "/timer": TimerRender,
    "/const_tasks": ConstTasksRender,
    "/dashboard": Dashboard,
    "/about": About,
  };

  const mainContent = document.getElementById("main-content");

  const init = () => {
    const router = new Navigo("/", { hash: true });

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
