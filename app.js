import Router from "./src/routes";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import "/node_modules/flatpickr/dist/flatpickr.min.css";
import "/node_modules/flatpickr/dist/themes/light.css";
import Main from "./src/main";
import getSuggestion from "./src/services/getSuggestion";

const App = () => {
  Main();
  Router.init();
  inject();
  injectSpeedInsights();
};

App();
