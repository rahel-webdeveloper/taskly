import Profile from "./components/Profile";
import SignInBtn from "./components/SignInBtn";
import { router } from "./routes";
import authService, { token, userData, userId } from "./services/auth.service";
import openNotification from "./services/toastNotifications";

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
        navbarRight.innerHTML = Profile({ data: userData.get() });

        controProfileEvents();
      });
    else {
      navbarRight.innerHTML = Profile({ data: userData.get() });

      controProfileEvents();
    }
  } else {
    document.startViewTransition
      ? document.startViewTransition(
          () => (navbarRight.innerHTML = SignInBtn())
        )
      : (navbarRight.innerHTML = SignInBtn());
  }
};

const controProfileEvents = () => {
  const profilePopover = document.getElementById("profile-popover");

  profilePopover?.addEventListener("click", (e) => {
    e.preventDefault();

    const target = e.target;

    if (
      target.closest("#logout-btn") &&
      authService.isAuthenticated(token.get())
    ) {
      authService.signOut();
      router.navigate("/auth/sign-in");
    }

    if (target.closest("#create-acount-btn")) {
      authService.signOut();
      router.navigate("/auth/sign-up");
    }

    if (target.closest("#settings-btn"))
      openNotification("info", "This feature is under development");
  });
};

setTimeout(() => authService.controlleLogged(userId.get()), 1500);

export default activeLink;
