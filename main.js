import App from "./src/App";
import Router from "./src/routes";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

const Main = () => {
  App();
  Router.init();
  inject();
  injectSpeedInsights();
};

Main();
