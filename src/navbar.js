import SidebarMenu from "./components/SidebarMenu";
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

export const renderSidebar = (protect) => {
  const sidebarMenuContainer = document.getElementById("sidebar_menu");

  sidebarMenuContainer.innerHTML = "";

  if (protect) {
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

const singInBtn = document.querySelector(".sign-in-btn");

export default activeLink;
