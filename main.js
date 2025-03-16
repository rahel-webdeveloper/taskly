import { SpeedInsights } from "@vercel/speed-insights/next";
import App from "./src/App";
import Router from "./src/routes";

const Main = () => {
  App();
  SpeedInsights();
  Router.init();
};

Main();
