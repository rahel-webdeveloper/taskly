import Profile from "./components/Profile";
import { authServices } from "./pages/auth/AuthLogic";
import { token, userData, userId } from "./pages/auth/store";
import SignInBtn from "./components/SignInBtn";

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
  const navbarRight = document.querySelector(".navbar-right");

  if (isLogged) {
    if (document.startViewTransition)
      document.startViewTransition(() => {
        navbarRight.innerHTML = Profile({ data: null });
        const profilePictue = document.querySelector(".profile span p");
        profilePictue.textContent = userData.get().name.slice(0, 1);

        controLogoutFunc();
      });
    else {
      navbarRight.innerHTML = Profile({ data: null });
      const profilePictue = document.querySelector(".profile span p");
      profilePictue.textContent = userData.get().name.slice(0, 1);

      controLogoutFunc();
    }
  } else {
    document.startViewTransition
      ? document.startViewTransition(
          () => (navbarRight.innerHTML = SignInBtn())
        )
      : (navbarRight.innerHTML = SignInBtn());
  }
};

const controLogoutFunc = () => {
  const logoutBtn = document.getElementById("profile-picture");

  logoutBtn?.addEventListener("click", function (e) {
    e.preventDefault();
    if (authServices.isLogged(token.get())) authServices.signOut();
  });
};

authServices.controlleLogged(userId.get());

const singInBtn = document.querySelector(".sign-in-btn");

export default activeLink;
