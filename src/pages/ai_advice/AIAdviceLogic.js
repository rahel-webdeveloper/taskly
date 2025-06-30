import hljs from "highlight.js/lib/core";
import Showdown from "showdown";
import getAdvice from "./getAdvice";
import { loadingDivRend, welcomeMessageRender } from "./AIAdviceRender";

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
import { taskToAssistant } from "../../tasks/store";
import { deleteLocalStorage } from "../../data/localStorage";

export const converter = new Showdown.Converter({
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
  backslashEscapesHTMLTags: true,
  ghCompatibleHeaderId: true,
  customizedHeaderId: true,
  ghMentionsLink: true,
  parseImgDimensions: true,
  smoothLivePreview: true,
  smartIndentationFix: true,
});

const AIAdviceLogic = async () => {
  const aiAdviceContainerEl = document.querySelector(".ai-advice_container");

  if (aiAdviceContainerEl) {
    addStyleToMarkdownContainer();
    getUserInput();
  }
};

export const getUserInput = async () => {
  const aiAdviceContainer = document.querySelector(
    ".ai-advice_container"
  ).style;
  const inputSubmitBox = document.querySelector(".input-submit_box");
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInputEl = document.getElementById("user-input");
  const navbarMenu = document.getElementById("navbar_menu");

  userInputEl.addEventListener("focusin", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;

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

    deleteLocalStorage("task-to-assistant");

    const isWindowLarge = window.innerWidth > 1024;

    renderAdviceInHtml(userInputEl.value);

    userInputEl.value = "";
    getAdviceBtn.disabled = true;

    userInputEl.style.height = `3rem`;

    isWindowLarge
      ? (aiAdviceContainer.cssText += `align-content: start; padding-bottom: 3.7rem;`)
      : (aiAdviceContainer.cssText += `align-content: start; padding-bottom: 2rem;`);
  });

  if (taskToAssistant.get().length !== 0) {
    userInputEl.value = `Act as project manager for my this task:
    description: ${taskToAssistant.get()[0].description},
    priority: ${taskToAssistant.get()[0].priority.label},
    start time: ${new Date(
      taskToAssistant.get()[0].startDateTime
    ).toLocaleString()},
    duration minutes: ${taskToAssistant.get()[0].durationMinutes}m`;
    getAdviceBtn.disabled = false;
  }
};

export const addStyleToMarkdownContainer = () => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.style.cssText += `
  min-width: 200px;
  width: 100%;
  max-width: 980px;
  margin: 1.77rem auto 3rem;
  background-color: #14161e;
  color: #f1f0f0;
  border-radius: 1rem;
`;

  window.addEventListener("load", () => {
    responseAreaEl.innerHTML = welcomeMessageRender();
  });
};

const renderAdviceInHtml = async (userInput) => {
  const responseAreaEl = document.getElementById("response-area");
  const welcomeMessage = document.querySelector(".ai-welcome_message");

  welcomeMessage.style.display = "none";

  const userEl = document.createElement("span");
  userEl.classList.add("user-message");
  userEl.textContent = userInput.trim();

  const assistantEl = document.createElement("div");

  responseAreaEl.appendChild(userEl);
  responseAreaEl.innerHTML += loadingDivRend();
  responseAreaEl.appendChild(assistantEl);

  const loadingDiv = document.querySelectorAll(".think-div");

  let fullMarkdown = "";

  try {
    // Add user input
    historyMessages.get().push({ role: "user", content: userInput.trim() });

    const response = await getAdvice();

    // **---- For complete response

    // Add response of assistant
    // historyMessages
    //   .get()
    //   .push({ role: "assistant", content: response.message.content[0].text });

    // Conver markdown to html content
    // const htmlContent = converter.makeHtml(response.message.content[0].text);

    // for (let i = 0; i < thinkDiv.length; i++)
    //   thinkDiv[i].style.display = "none";

    // responseAreaEl.innerHTML += htmlContent;

    // For streaming response
    for await (const part of response) {
      fullMarkdown += part?.text;

      const htmlContent = converter.makeHtml(fullMarkdown);
      assistantEl.innerHTML = htmlContent;
    }
    historyMessages.get().push({ role: "assistant", content: fullMarkdown });

    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();
  } catch (err) {
    for (let i = 0; i < loadingDiv.length; i++)
      loadingDiv[i].style.display = "none";

    responseAreaEl.innerHTML += `
       <div class="catch-error">
       <i class="bi bi-exclamation-circle"></i>
       <span> ${
         err.message === "puter is not defined"
           ? "Check your internet and try again!"
           : err.error.delegate == "usage-limited-chat"
           ? "Usage limit exceeded!"
           : " Something went wrong!"
       }</span>
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
