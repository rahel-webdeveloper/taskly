import WelcomeLogic from "./WelcomeLogic";
import emailjs from "@emailjs/browser";

const MainWelcome = () => {
  document.addEventListener("DOMContentLoaded", () => {
    emailjs.init(import.meta.env.VITE_PUBLIC_KEY);
    WelcomeLogic();
  });
};

export default MainWelcome;
