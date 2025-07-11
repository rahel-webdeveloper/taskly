import openNotification from "./services/toastNotifications";

const activeLink = (attribute = "/") => {
  const links = document.querySelectorAll(".navbar-links a");

  links.forEach((el) => {
    const linkAttribute = el.getAttribute("href");

    linkAttribute === attribute
      ? el.classList.add("active-link")
      : el.classList.remove("active-link");
  });
};

const singInBtn = document.querySelector(".sign-in-btn");

singInBtn.addEventListener("click", () =>
  openNotification("info", "This feature is coming soon! Stay tuned!")
);

export default activeLink;
