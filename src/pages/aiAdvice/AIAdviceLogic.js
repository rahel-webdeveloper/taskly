import {
  chatErrorCompo,
  conveListCompo,
  welcomeMessageCompo,
} from "./AIAdviceRender";
import loadingDivComp from "../../components/Loading.js";
import "highlight.js/styles/atom-one-dark.css";

import { removeLocalStorage, saveLocalStorage } from "../../data/localStorage";
import { taskToAssistant } from "../../tasks/store";
import getAdvice, {
  activeConversation_Id,
  conversations,
  converter,
  deleteConversation,
  findActiveConversation,
  highlightCode,
  systemMsg,
} from "./store";

export const AIAdviceLogic = () => {
  getUserInputController();
  onReloadAIPageContro();

  renderConversationList();
};

// ***------------   AI Page Dynamic UI

export const onReloadAIPageContro = () => {
  renderWelcomeMessage(true);

  if (
    conversations.get().length > 0 &&
    conversations.get()[0].messages.length === 1
  ) {
    activeConversation_Id.set(conversations.get()[0].id);
    addStyleToActiveConve(activeConversation_Id.get());
  }
};

export const eventsHandler = (event) => {
  const target = event.target;

  if (target.closest("#sidebar_show-btn")) toggleAiSideBar(true);

  if (target.closest("#sidebar_hide-btn")) toggleAiSideBar(false);

  if (target.closest("#new_chat")) createNewConve();

  if (
    target.closest("#ai__sidebar") &&
    !target.closest(".conversation__Library")
  )
    toggleAiSideBar(false);

  if (target.closest(".conversation div")) {
    activeConversation_Id.set(target.getAttribute("data-id"));
    toggleAiSideBar(false);

    if (document.startViewTransition)
      document.startViewTransition(() =>
        renderActiveConve_Messages(activeConversation_Id.get())
      );
    else renderActiveConve_Messages(activeConversation_Id.get());

    addStyleToActiveConve(activeConversation_Id.get());
  }

  if (target.closest("#convers_delete-icon"))
    deleteConversation(target.getAttribute("data-id"));
};

export const toggleAiSideBar = (show = false) => {
  const aiSideBar = document.getElementById("ai__sidebar");

  if (!aiSideBar) return;

  const aiSideBarStyle = aiSideBar.style;

  if (show) aiSideBarStyle.left = "50%";

  if (!show) aiSideBarStyle.left = "-50%";
};

const userFocusIn_OutContro = (userInputEl) => {
  const inputSubmitBox = document.querySelector(".input-submit_box");

  const navbarMenu = document.getElementById("sidebar_menu");

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
    givenTaskTo_AssistantContro(userInputEl, getAdviceBtn);
};

// ***---------        Send task to assitant controller
const givenTaskTo_AssistantContro = (userInputEl, getAdviceBtn) => {
  userInputEl.value = `Act as project manager for my this task:
  title: ${taskToAssistant.get()[0].title}

  description: ${taskToAssistant.get()[0].description}

  start time: ${new Date(
    taskToAssistant.get()[0].startDateTime
  ).toLocaleString()},
  duration minutes: ${taskToAssistant.get()[0].duration}m`;
  getAdviceBtn.disabled = false;
};

const sendPrompt = (getAdviceBtn, userInputEl) => {
  const aiAdviceContainerStyle = document.querySelector(
    ".ai-advice_container"
  ).style;

  if (userInputEl.value.trim() === "") return;

  removeLocalStorage("task-to-assistant");

  const isWindowLarge = window.innerWidth >= 1024;

  renderAdviceInHtml(userInputEl.value);

  userInputEl.value = "";
  getAdviceBtn.disabled = true;

  userInputEl.style.height = `3rem`;

  isWindowLarge
    ? (aiAdviceContainerStyle.cssText += `align-content: start; padding-bottom: 5rem;`)
    : (aiAdviceContainerStyle.cssText += `align-content: start; padding-bottom: 4rem;`);
};

const renderAdviceInHtml = async (userInput) => {
  const chatAreaEl = document.getElementById("chat_area");

  if (!findActiveConversation(activeConversation_Id.get())) createNewConve();

  if (findActiveConversation(activeConversation_Id.get()).messages.length === 1)
    renderWelcomeMessage(false);

  const userEl = document.createElement("span");
  userEl.classList.add("user");
  userEl.textContent = userInput.trim();

  const assistantEl = document.createElement("article");
  assistantEl.classList.add("markdown-body");
  assistantEl.style.cssText += `
  background-color: #0a0a0a;
  color: #f8f8f8;
  `;

  chatAreaEl.appendChild(userEl);
  chatAreaEl.innerHTML += loadingDivComp();
  chatAreaEl.appendChild(assistantEl);

  const loadingDiv = document.querySelectorAll(".loading-div");

  let fullMarkdown = "";

  try {
    // Add user input
    findActiveConversation(activeConversation_Id.get()).messages.push({
      role: "user",
      content: userInput.trim(),
    });

    const response = await getAdvice(
      findActiveConversation(activeConversation_Id.get()).messages
    );

    // **---------     For streaming response
    for await (const part of response) {
      fullMarkdown += part?.text;

      const htmlContent = converter.makeHtml(fullMarkdown);
      assistantEl.innerHTML = htmlContent;
      chatAreaEl.scrollTo({
        top: chatAreaEl.scrollHeight,
        behavior: "smooth",
      });
    }
    findActiveConversation(activeConversation_Id.get()).messages.push({
      role: "assistant",
      content: fullMarkdown,
    });

    saveLocalStorage(conversations.get(), "all_Conversations");

    // **------   Delete loading div after completing response

    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();
  } catch (err) {
    for (let i = 0; i < loadingDiv.length; i++) loadingDiv[i].remove();

    chatAreaEl.innerHTML += chatErrorCompo(err);
  }

  highlightCode();
};

const addStyleToActiveConve = (id) => {
  const conversationEls = document.querySelectorAll(".conversation");

  conversationEls.forEach((conveEl) => {
    const conveElDataId = conveEl.getAttribute("data-id");

    conveElDataId === id
      ? conveEl.classList.add("active__conver")
      : conveEl.classList.remove("active__conver");
  });
};

export const renderActiveConve_Messages = (id) => {
  const chatAreaEl = document.getElementById("chat_area");

  chatAreaEl.innerHTML = "";

  if (
    !findActiveConversation(id) ||
    findActiveConversation(id).messages.length === 1
  )
    renderWelcomeMessage(true);

  findActiveConversation(id).messages.forEach((message) => {
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
      background-color: #0a0a0a;
      color: #f8f8f8;
      `;

      chatAreaEl.appendChild(assistantEl);
      assistantEl.innerHTML = converter.makeHtml(message.content);
    }
  });

  highlightCode();
};

const emptyConve_Controller = () => {
  addStyleToActiveConve(activeConversation_Id.get());
  if (
    conversations.get().length !== 0 &&
    conversations.get()[0].messages.length === 1
  ) {
    renderWelcomeMessage(true);
    activeConversation_Id.set(conversations.get()[0].id);
    addStyleToActiveConve(activeConversation_Id.get());

    return false;
  } else return true;
};

const createNewConve = () => {
  // ***   Don't create new conversation if user didn't send any message in last conversation
  if (!emptyConve_Controller()) return;

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

  activeConversation_Id.set(Id);

  saveLocalStorage(conversations.get(), "all_Conversations");

  document.startViewTransition
    ? document.startViewTransition(() => renderConversationList())
    : renderConversationList();
};

export const renderConversationList = () => {
  const conversationListEl = document.getElementById("conversation__list");

  conversationListEl.innerHTML = "";

  if (conversations.get().length === 0)
    conversationListEl.innerHTML = `<h5 align="center">No Conversation Exist! <br> Time to start new conversation</h5>`;

  conversations.get().forEach((conversation) => {
    conversationListEl.innerHTML += conveListCompo(conversation);
  });
};

export function renderMessageInList(conversation) {
  const userMessage = `${
    conversation.messages.length === 1
      ? "No message sended!"
      : conversation.messages[1].role === "user"
      ? conversation.messages[1].content.slice(0, 35)
      : ""
  }`;

  const assistantMessage = `${
    conversation.messages.length === 1
      ? conversation.title
      : conversation.messages[2] &&
        conversation.messages[2].role === "assistant"
      ? conversation.messages[2].content.slice(0, 85)
      : "Not answared this question"
  }`;

  return { userMessage, assistantMessage };
}

export const renderWelcomeMessage = (show_Welcome) => {
  const chatAreaEl = document.getElementById("chat_area");
  const welcomeMessage = document.querySelector(".ai-welcome_message");

  show_Welcome
    ? (chatAreaEl.innerHTML = welcomeMessageCompo())
    : welcomeMessage.remove();
};

export function controAllConversaOperation() {
  saveLocalStorage(conversations.get(), "all_Conversations");

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      renderConversationList();
      renderActiveConve_Messages(activeConversation_Id.get());
    });
  } else {
    renderConversationList();
    renderActiveConve_Messages(activeConversation_Id.get());
  }
}
