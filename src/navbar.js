import Profile from "./components/Profile";
import SidebarMenu from "./components/SidebarMenu";
import SignInBtn from "./components/SignInBtn";
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

export const renderSidebar = (isLogged) => {
  const sidebarMenuContainer = document.getElementById("sidebar_menu");

  sidebarMenuContainer.innerHTML = "";

  if (isLogged) {
    sidebarMenuContainer.style.display = "block";
    document.startViewTransition
      ? document.startViewTransition(
          () => (sidebarMenuContainer.innerHTML = SidebarMenu())
        )
      : (sidebarMenuContainer.innerHTML = SidebarMenu());
  } else {
    sidebarMenuContainer.innerHTML = "";
    sidebarMenuContainer.style.display = "none";
  }
};

renderSidebar(true);

export const renderProfile = (isLogged) => {
  const navbarRight = document.querySelector(".navbar-right");

  if (isLogged) {
    navbarRight.innerHTML = Profile({ data: null });
  } else {
    navbarRight.innerHTML = SignInBtn();
  }
};

renderProfile();

const singInBtn = document.querySelector(".sign-in-btn");

export default activeLink;
