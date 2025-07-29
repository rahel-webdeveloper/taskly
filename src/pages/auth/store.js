import { atom } from "nanostores";
import { SignInRender, SignUpRender } from "./AuthRender";

export const userId = atom("688769627fb1de373de97cbb" || null);

export const navigateAuthPages = (route) => {
  const authContainer = document.querySelector(".auth");

  if (route === "sign-in") {
    authContainer.innerHTML = SignInRender();
    authContainer.classList.add("auth--signin");
    authContainer.classList.remove("auth--signup");
  }
  if (route === "sign-up") {
    authContainer.innerHTML = SignUpRender();
    authContainer.classList.remove("auth--signin");
    authContainer.classList.add("auth--signup");
  }
};
