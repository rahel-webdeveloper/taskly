import { atom } from "nanostores";
import { SignInRender, SignUpRender } from "./AuthRender";
import { router } from "../../routes";

export const userId = atom(localStorage.getItem("userId") || null);
export const token = atom(localStorage.getItem("tasklyToken") || null);
export const userData = atom(null);

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
