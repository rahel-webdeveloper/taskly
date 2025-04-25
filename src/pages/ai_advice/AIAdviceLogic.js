import hljs from "highlight.js/lib/core";
import Showdown from "showdown";
import getAdvice from "./advisor";
import { loadingDiv, welcomeMessageRender } from "./AIAdviceRender";

import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import "highlight.js/styles/atom-one-dark.css";
import { historyMessages, markdownText } from "./store";

const converter = new Showdown.Converter({
  tables: true,
  emoji: true,
  strikethrough: false,
  ghMentions: true,
  simpleLineBreaks: true,
  underline: true,
  omitExtraWLInCodeBlocks: true,
  ghCodeBlocks: true,
  disableForced4SpacesIndentedSublists: true,
  tasklists: true,
  simplifiedAutoLink: true,
  metadata: true,
});

const AIAdviceLogic = async () => {
  const aiAdviceContainerEl = document.querySelector(".ai-advice_container");
  const getAdviceBtn = document.getElementById("get-advice_btn");

  if (aiAdviceContainerEl) {
    addStyleToMarkdownContainer();
    getUserInput();
  }
};

const getUserInput = async () => {
  const inputSubmitBox = document.querySelector(".input-submit_box");
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInputEl = document.getElementById("user-input");
  const navbarMenu = document.getElementById("navbar_menu");

  userInputEl.addEventListener("focusin", () => {
    const isWindowLarge = window.innerWidth > 1024;

    navbarMenu.style.scale = `${!isWindowLarge ? "0" : "1"}`;

    inputSubmitBox.style.bottom = `${isWindowLarge ? "3rem" : ".57rem"}`;
  });

  userInputEl.addEventListener("focusout", () => {
    if (!userInputEl.value) {
      const isWindowSmall = window.innerWidth < 1024;

      navbarMenu.style.scale = "1";

      inputSubmitBox.style.bottom = `${!isWindowSmall ? "3rem" : "6.25rem"}`;
    }
  });

  userInputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;

    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);
  });

  getAdviceBtn.addEventListener("click", () => {
    if (userInputEl.value.trim() === "") return;

    renderAdviceInHtml(userInputEl.value);

    userInputEl.value = "";
    getAdviceBtn.disabled = true;

    userInputEl.style.height = `3rem`;
  });
};

const addStyleToMarkdownContainer = () => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.style.cssText += `
  min-width: 200px;
  width: 100%;
  max-width: 980px;
  margin: 1.77rem auto 3rem;
  background-color: #14161e;
  border-radius: 1rem;
`;

  responseAreaEl.innerHTML = welcomeMessageRender();
};

const renderAdviceInHtml = async (userInput) => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.innerHTML += `<span class="user-message">${userInput.trim()}</span>`;
  try {
    // responseAreaEl.innerHTML += loadingDiv();
    // responseAreaEl.style.cssText += `align-content: start;`;

    historyMessages.get().push({ role: "user", content: userInput.trim() });

    const response = await getAdvice();

    historyMessages
      .get()
      .push({ role: "assistant", content: response.message.content[0].text });

    // historyMessages
    //   .get()
    //   .push({ role: "assistant", content: response.message.content });

    // const htmlContent = converter.makeHtml(response.message.content);

    const htmlContent = converter.makeHtml(response.message.content[0].text);

    responseAreaEl.innerHTML += htmlContent;

    // For streaming response
    // for await (const part of response) {
    //   responseAreaEl.innerHTML += part.content;
    // }

    // const htmlContent = converter.makeHtml(markdownText);

    // setTimeout(() => (responseAreaEl.innerHTML = htmlContent), 2000);
  } catch (err) {
    responseAreaEl.innerHTML += `
     <div class="catch-error">
     <strong>${
       err.message === "puter is not defined"
         ? "Check your internet and try again!"
         : err.error.delegate == "usage-limited-chat"
         ? "Usage limit exceeded!"
         : " Something went wrong!"
     }</strong>
     </div>
  `;
  }

  highlightCode();
};

const highlightCode = () => {
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("html", html);
  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("json", json);

  // Initilize the highlight.js
  hljs.highlightAll();
};

export default AIAdviceLogic;
