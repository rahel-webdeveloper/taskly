import {
  conveListCompo,
  loadingDivComp,
  welcomeMessageCompo,
} from "./AIAdviceRender";

import "highlight.js/styles/atom-one-dark.css";

import { deleteLocalStorage, saveLocalStorage } from "../../data/localStorage";
import { taskToAssistant } from "../../tasks/store";
import getAdvice, {
  activeConversation_Id,
  conversations,
  converter,
  highlightCode,
  historyMessages,
  systemMsg,
} from "./store";
import { systemMessage } from "../task_hub/store";

const AIAdviceLogic = async () => {
  const aiAdviceContainerEl = document.querySelector(".ai-advice_container");

  if (aiAdviceContainerEl) {
    styleOfChatContainerAfter_Loading();
    getUserInputController();
    renderConversationList();

    aiAdviceContainerEl.addEventListener("click", aiPageEvents);
    window.addEventListener("resize", () => toggleAiSideBar(false));
  }
};

// ***------------   AI Page Dynamic UI

const styleOfChatContainerAfter_Loading = () => {
  const chatAreaEl = document.getElementById("chat_area");

  chatAreaEl.style.cssText += `
  min-width: 200px;
  width: 100%;
  max-width: 980px;
  margin: 1.77rem auto 3rem;
  background-color: #020408;
  color: #f1f0f0;
  border-radius: 1rem;
`;

  window.addEventListener("load", () => {
    renderWelcomeMessage(true);

    if (conversations.get()[0].messages.length === 1) {
      activeConversation_Id.set(conversations.get()[0].id);
      addStyleToActiveConve(activeConversation_Id.get());
    }
  });
};

const aiPageEvents = (event) => {
  const target = event.target;

  if (target.closest("#sidebar_show-btn")) toggleAiSideBar(true);

  if (target.closest("#sidebar_hide-btn")) toggleAiSideBar(false);

  if (target.closest("#new_chat")) createNewConve();

  if (target.closest(".conversation")) {
    activeConversation_Id.set(target.getAttribute("data-id"));
    toggleAiSideBar(false);

    if (document.startViewTransition)
      document.startViewTransition(() =>
        renderMessages(activeConversation_Id.get())
      );
    else renderMessages(activeConversation_Id.get());

    addStyleToActiveConve(activeConversation_Id.get());
  }
};

const toggleAiSideBar = (show = false) => {
  const aiSideBarStyle = document.getElementById("ai__sidebar").style;

  const isWindowLarge = window.innerWidth >= 1024;

  if (show && !isWindowLarge) aiSideBarStyle.left = "50%";
  else if (show && isWindowLarge) aiSideBarStyle.left = "12.5%";

  if (!show && !isWindowLarge) aiSideBarStyle.left = "-50%";
  else if (!show && isWindowLarge) aiSideBarStyle.left = "-15%";
};

const userFocusIn_OutContro = (userInputEl) => {
  const inputSubmitBox = document.querySelector(".input-submit_box");

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
};

export const getUserInputController = async () => {
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInputEl = document.getElementById("user-input");

  userFocusIn_OutContro(userInputEl);

  // **----- Controll style when user typing

  userInputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
    this.style.maxHeight = `${200}px`;

    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);
  });

  // **----- Send Prompt by Pressing Button
  getAdviceBtn.addEventListener("click", () =>
    sendPrompt(getAdviceBtn, userInputEl)
  );

  // **----- Send Prompt by Pressing Enter
  userInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendPrompt(getAdviceBtn, userInputEl);
    }
  });

  // ***-------   Send task to AI chat from task list
  if (taskToAssistant.get().length !== 0)
    sendTaskController(userInputEl, getAdviceBtn);
};

// ***---------        Send task to assitant controller
const sendTaskController = (userInputEl, getAdviceBtn) => {
  userInputEl.value = `Act as project manager for my this task:
  title: ${taskToAssistant.get()[0].title}

  description: ${taskToAssistant.get()[0].description}

  start time: ${new Date(
    taskToAssistant.get()[0].startDateTime
  ).toLocaleString()},
  duration minutes: ${taskToAssistant.get()[0].durationMinutes}m`;
  getAdviceBtn.disabled = false;
};

const sendPrompt = (getAdviceBtn, userInputEl) => {
  const aiAdviceContainerStyle = document.querySelector(
    ".ai-advice_container"
  ).style;

  if (userInputEl.value.trim() === "") return;

  deleteLocalStorage("task-to-assistant");

  const isWindowLarge = window.innerWidth >= 1024;

  renderAdviceInHtml(userInputEl.value);

  userInputEl.value = "";
  getAdviceBtn.disabled = true;

  userInputEl.style.height = `3rem`;

  isWindowLarge
    ? (aiAdviceContainerStyle.cssText += `align-content: start; padding-bottom: 4rem;`)
    : (aiAdviceContainerStyle.cssText += `align-content: start; padding-bottom: 4rem;`);
};

const renderAdviceInHtml = async (userInput) => {
  const chatAreaEl = document.getElementById("chat_area");

  if (activeCoversation(activeConversation_Id.get()).messages.length === 1)
    renderWelcomeMessage(false);

  const userEl = document.createElement("span");
  userEl.classList.add("user");
  userEl.textContent = userInput.trim();

  const assistantEl = document.createElement("article");
  assistantEl.classList.add("markdown-body");
  assistantEl.style.cssText += `
  background-color: #020408;
  color: #f8f8f8;
  `;

  chatAreaEl.appendChild(userEl);
  chatAreaEl.innerHTML += loadingDivComp();
  chatAreaEl.appendChild(assistantEl);

  const loadingDiv = document.querySelectorAll(".think-div");

  let fullMarkdown = "";

  try {
    // Add user input
    activeCoversation(activeConversation_Id.get()).messages.push({
      role: "user",
      content: userInput.trim(),
    });

    const response = await getAdvice(
      activeCoversation(activeConversation_Id.get()).messages
    );

    // **---------     For streaming response
    for await (const part of response) {
      fullMarkdown += part?.text;

      const htmlContent = converter.makeHtml(fullMarkdown);
      assistantEl.innerHTML = htmlContent;
      chatAreaEl.scrollTop = chatAreaEl.scrollHeight;
    }
    activeCoversation(activeConversation_Id.get()).messages.push({
      role: "assistant",
      content: fullMarkdown,
    });

    saveLocalStorage(conversations.get(), "all_Conversations");

    // **------   Delete loading div after completing response

    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();
  } catch (err) {
    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();

    chatAreaEl.innerHTML += `
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

function activeCoversation(id) {
  return conversations.get().find((conve) => conve.id === id);
}

const addStyleToActiveConve = (id) => {
  const conversationEls = document.querySelectorAll(".conversation");

  conversationEls.forEach((conveEl) => {
    const conveElDataId = conveEl.getAttribute("data-id");

    conveElDataId === id
      ? conveEl.classList.add("active__conver")
      : conveEl.classList.remove("active__conver");
  });
};

const renderMessages = (id) => {
  const chatAreaEl = document.getElementById("chat_area");

  chatAreaEl.innerHTML = "";

  if (activeCoversation(id).messages.length === 1) renderWelcomeMessage(true);

  activeCoversation(id).messages.forEach((message) => {
    if (message.role === "user") {
      const userEl = document.createElement("span");
      userEl.classList.add("user");
      userEl.textContent = message.content;

      chatAreaEl.appendChild(userEl);
    }

    if (message.role === "assistant") {
      const assistantEl = document.createElement("article");
      assistantEl.classList.add("markdown-body");
      assistantEl.style.cssText += `
      background-color: #020408;
      color: #f8f8f8;
      `;

      chatAreaEl.appendChild(assistantEl);
      assistantEl.innerHTML = converter.makeHtml(message.content);
    }
  });
};

const createNewConve = () => {
  // ***_________  Don't create new conversation if user didn't send any message in last conversation

  addStyleToActiveConve(activeConversation_Id.get());
  if (
    conversations.get().length !== 0 &&
    conversations.get()[0].messages.length === 1
  ) {
    renderWelcomeMessage(true);
    activeConversation_Id.set(conversations.get()[0].id);
    addStyleToActiveConve(activeConversation_Id.get());

    return;
  }

  const Id = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  conversations.set([
    {
      id: Id,
      title: `Chat-${Id.slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      messages: [systemMsg],
    },
    ...conversations.get(),
  ]);

  saveLocalStorage(conversations.get(), "all_Conversations");

  if (document.startViewTransition) {
    document.startViewTransition(() => renderConversationList());
  } else {
    renderConversationList();
  }
};

const renderConversationList = () => {
  const conversationListEl = document.getElementById("conversation__list");

  conversationListEl.innerHTML = "";

  if (conversations.get().length === 0)
    conversationListEl.innerHTML = `<h5 align="center">No Conversation Exist! <br> Time to start new conversation</h5>`;

  conversations.get().forEach((conve) => {
    conversationListEl.innerHTML += conveListCompo(conve);
  });
};

const renderWelcomeMessage = (show_Welcome) => {
  const chatAreaEl = document.getElementById("chat_area");
  const welcomeMessage = document.querySelector(".ai-welcome_message");

  show_Welcome
    ? (chatAreaEl.innerHTML = welcomeMessageCompo())
    : welcomeMessage.remove();
};

// **-----------    Find current chat and update that one

export default AIAdviceLogic;
