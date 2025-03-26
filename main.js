import App from "./src/App";
import Router from "./src/routes";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "/node_modules/flatpickr/dist/themes/light.css";

const Main = () => {
  App();
  Router.init();
  inject();
  injectSpeedInsights();
};

Main();
