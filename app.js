import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import Router from "./src/routes";
import "/node_modules/flatpickr/dist/flatpickr.min.css";
import "/node_modules/flatpickr/dist/themes/light.css";
import emailjs from "@emailjs/browser";

const App = () => {
  Router();
  inject();
  injectSpeedInsights();
  emailjs.init(import.meta.env.VITE_PUBLIC_KEY);
};

App();
