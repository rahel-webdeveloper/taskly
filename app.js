import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import Router from "./src/routes";
import "/node_modules/flatpickr/dist/flatpickr.min.css";
import "/node_modules/flatpickr/dist/themes/light.css";
import emailjs from "@emailjs/browser";
import SendSuggestionMain from "./src/services/send_Sug";

const App = () => {
  Router();
  SendSuggestionMain();
  inject();
  injectSpeedInsights();
  emailjs.init(import.meta.env.VITE_PUBLIC_KEY);
};

App();
