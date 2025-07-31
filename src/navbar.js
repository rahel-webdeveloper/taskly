import Profile from "./components/Profile";
import SignInBtn from "./components/SignInBtn";
import authService, { userData, userId } from "./services/auth.service";

const activeLink = (attribute = "/") => {
  const links = document.querySelectorAll(".sidebar-links a");

  links.forEach((el) => {
    const linkAttribute = el.getAttribute("href");

    linkAttribute === attribute
      ? el.classList.add("active-link")
      : el.classList.remove("active-link");
  });
};

export const showSidebar = (isAuthenticated = false) => {
  const sidebarMenuContainer = document.getElementById("sidebar_menu");

  isAuthenticated
    ? (sidebarMenuContainer.style.display = "flex")
    : (sidebarMenuContainer.style.display = "none");
};

export const showProfile = (isAuthenticated = false) => {
  const navbarRight = document.querySelector(".navbar-right");

  if (isAuthenticated) {
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
    // if (authServices.isAuthenticated(token.get())) authServices.signOut();
  });
};

authService.controlleLogged(userId.get());

const singInBtn = document.querySelector(".sign-in-btn");

export default activeLink;
