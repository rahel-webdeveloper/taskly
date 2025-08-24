import { Notyf } from "notyf";

const notyf = new Notyf({
  duration: 3700,
  dismissible: true,
  ripple: false,
  types: [
    {
      type: "success",
      background: "rgb(132, 214, 184, .45)",
      icon: "<i class='bi bi-check-circle-fill'></i>",
    },
    {
      type: "error",
      background: "rgb(237, 88, 95, .45)",
      icon: "<i class='bi bi-x-circle-fill'></i>",
    },
    {
      type: "warning",
      background: "rgb(237, 192, 123, .45)",
      icon: "<i class='bi bi-exclamation-triangle-fill'></i>",
    },
    {
      type: "info",
      background: "rgb(106, 179, 203, .45)",
      icon: "<i class='bi bi-info-circle-fill'></i>",
    },
  ],
});

const openNotification = (type, message) => {
  const innerWidth = window.innerWidth;

  // position on notyf base on device
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

  // add some custome style
  for (let i = 0; i < notyfToasts.length; i++) {
    notyfWrapper[i].style.cssText += ` 
    padding-block: 10px; padding-right: 45px;
    font-size: .9rem;
      `;

    notyfToasts[i].style.cssText +=
      "border-radius: .7rem; backdrop-filter: blur(12px); max-width: max-content; width: 90%; margin: 1.15rem .45rem .8rem 0;";
  }
};

export default openNotification;
