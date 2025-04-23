import hljs from "highlight.js/lib/core";
import Showdown from "showdown";
import getAdvice from "./advisor";
import { welcomeMessageRender } from "./AIAdviceRender";

import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

import "highlight.js/styles/atom-one-dark.css";

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

    navbarMenu.style.display = `${!isWindowLarge ? "none" : "block"}`;

    inputSubmitBox.style.bottom = `${isWindowLarge ? "3rem" : ".37rem"}`;
  });

  userInputEl.addEventListener("focusout", () => {
    if (!userInputEl.value) {
      const isWindowSmall = window.innerWidth < 1024;

      navbarMenu.style.display = "block";

      inputSubmitBox.style.bottom = `${!isWindowSmall ? "3rem" : "6.5rem"}`;
    }
  });

  userInputEl.addEventListener("input", function () {
    this.style.height = `${this.scrollHeight}px`;

    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);
  });

  getAdviceBtn.addEventListener("click", () => {
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
  background-color: #1a1d27;
  border-radius: 1rem;
  min-height: 65vh;
`;

  responseAreaEl.innerHTML = welcomeMessageRender();
};

const renderAdviceInHtml = async (userInput) => {
  const responseAreaEl = document.getElementById("response-area");

  responseAreaEl.innerHTML = `
   <div class="think-div">
   <h4>Thinking</h4>
    <div class="loader">
     <li class="ball"></li>
     <li class="ball"></li>
     <li class="ball"></li>
    </div>
   </div>
`;

  responseAreaEl.style.cssText += `align-content: start;`;

  const text = await getAdvice(userInput.trim());

  const htmlContent = converter.makeHtml(text.message.content);
  // const htmlContent = converter.makeHtml(markdownText);

  responseAreaEl.innerHTML = htmlContent;

  console.log(text);
  // setTimeout(() => (responseAreaEl.innerHTML = htmlContent), 300);

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
