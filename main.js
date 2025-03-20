import App from "./src/App";
import Router from "./src/routes";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

const Main = () => {
  App();
  Router.init();
  setTimeout(() => Router.router.updatePageLinks(), 1500);
  inject();
  injectSpeedInsights();
};

Main();
