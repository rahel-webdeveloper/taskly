import { Notyf } from "notyf";

const notyf = new Notyf({
  duration: 3700,
  dismissible: true,
  ripple: false,
  types: [
    {
      type: "success",
      background: "rgb(134, 181, 178, .87)",
    },
    {
      type: "error",
      background: "rgb(237, 88, 95, .87)",
    },
    {
      type: "warning",
      background: "rgb(237, 192, 123, .87)",
      icon: "<i class='bi bi-exclamation-circle-fill'></i>",
    },
    {
      type: "info",
      background: "rgb(176, 187, 188, .87)",
      icon: "<i class='bi bi-info-circle-fill'></i>",
    },
  ],
});

const openNotification = (type, message) => {
  const innerWidth = window.innerWidth;

  notyf.open({
    type: type,
    message: message,
    position:
      innerWidth <= 1024
        ? {
            x: "center",
            y: "top",
          }
        : {
            x: "right",
            y: "bottom",
          },
  });

  const notyfToasts = document.querySelectorAll(".notyf__toast");
  const notyfWrapper = document.querySelectorAll(".notyf__wrapper");

  for (let i = 0; i < notyfToasts.length; i++) {
    notyfWrapper[i].style.cssText +=
      " padding-block: 13px; padding-right: 45px;";

    notyfToasts[i].style.cssText +=
      "border-radius: 2rem .67rem .67rem 2rem; backdrop-filter: blur(12px); max-width: max-content; width: 90%; margin: 1.15rem .45rem .8rem 0;";
  }
};

export default openNotification;
