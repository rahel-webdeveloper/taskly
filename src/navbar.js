const activeLink = (attribute) => {
  const links = document.querySelectorAll(".navbar-links a");

  links.forEach((el) => {
    const linkAttribute = el.getAttribute("href");

    linkAttribute === attribute
      ? el.classList.add("active-link")
      : el.classList.remove("active-link");
  });
};

export default activeLink;
