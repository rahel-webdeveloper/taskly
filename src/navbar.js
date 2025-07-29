import { atom } from "nanostores";
import { userId } from "./pages/auth/store";
import APIClient from "./services/api-client";

export const userData = atom(null);

const activeLink = (attribute = "/") => {
  const links = document.querySelectorAll(".sidebar-links a");

  links.forEach((el) => {
    const linkAttribute = el.getAttribute("href");

    linkAttribute === attribute
      ? el.classList.add("active-link")
      : el.classList.remove("active-link");
  });
};

export const showSidebar = (isLogged = false) => {
  const sidebarMenuContainer = document.getElementById("sidebar_menu");

  if (isLogged) {
    sidebarMenuContainer.style.display = "flex";
  } else {
    sidebarMenuContainer.style.display = "none";
  }
};

export const showProfile = (isLogged = false) => {
  const profile = document.querySelector(".profile");
  const profilePictue = document.querySelector(".profile span p");
  const authBtn = document.querySelector("#auth-btn");

  if (isLogged) {
    profile.style.display = "flex";
    authBtn.style.display = "none";

    profilePictue.textContent = userData.get().name.slice(0, 1);
  } else {
    profile.style.display = "none";
    authBtn.style.display = "block";
  }
};

const apiClient = new APIClient("users");

apiClient
  .getUserById(userId.get())
  .then((res) => {
    if (res.success) {
      userData.set(res.data);
      showSidebar(true);
      showProfile(true);
    }
  })
  .catch((err) => console.log(err));

const singInBtn = document.querySelector(".sign-in-btn");

export default activeLink;
