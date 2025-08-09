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
  onReloadAIPageController();
  renderConversationList();
};

const aiAdviceEls = () => {
  const aiAdvicePage = document.querySelector(".ai-advice_page");
  const inputSubmitBox = document.querySelector(".input-submit_box");
  const sidebarMenu = document.getElementById("sidebar_menu");
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInput = document.getElementById("user-input");
  const chatArea = document.getElementById("chat_area");
  const loadingDiv = document.querySelectorAll(".loading-div");
  const aiAdviceOutput = document.querySelector(".ai-advice-output");
  const conversations = document.querySelectorAll(".conversation");
  const conversationList = document.getElementById("conversation__list");
  const welcomeMessage = document.querySelector(".ai-welcome_message");

  return {
    aiAdvicePage,
    inputSubmitBox,
    sidebarMenu,
    getAdviceBtn,
    userInput,
    loadingDiv,
    chatArea,
    aiAdviceOutput,
    conversations,
    conversationList,
    welcomeMessage,
  };
};

// ***------------   AI Page Dynamic UI

export const onReloadAIPageController = () => {
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

  // Hide AI sidebar if event was out of sidebar
  // if (
  //   target.closest("#ai__sidebar") &&
  //   !target.closest(".conversation__Library")
  // )
  //   toggleAiSideBar(false);

  // Events inter of AI sidebar
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

const userFocusIn_OutController = () => {
  const { aiAdvicePage, inputSubmitBox, sidebarMenu, userInput } =
    aiAdviceEls();

  userInput.addEventListener("focusin", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;

    const isWindowLarge = window.innerWidth > 1024;

    aiAdvicePage.style.paddingBottom = `${isWindowLarge ? "2.5rem" : "1.3rem"}`;
    sidebarMenu.style.scale = `${!isWindowLarge ? "0" : "1"}`;
    inputSubmitBox.style.marginBottom = `${isWindowLarge ? "3rem" : "1.5rem"}`;

    scrollToEndOfChat();
  });

  userInput.addEventListener("focusout", () => {
    if (!userInput.value) {
      const isWindowSmall = window.innerWidth < 1024;
      aiAdvicePage.style.paddingBottom = `${
        isWindowSmall ? "5.5rem" : "2.5rem"
      }`;
      sidebarMenu.style.scale = "1";
      inputSubmitBox.style.marginBottom = `${!isWindowSmall ? "3rem" : "6rem"}`;
    }
  });

  window.addEventListener("resize", function () {
    sidebarMenu.style.scale = "1";

    if (this.window.innerWidth >= 1024) {
      aiAdvicePage.style.paddingBottom = "2.5rem";
      inputSubmitBox.style.marginBottom = "3rem";
    } else {
      aiAdvicePage.style.paddingBottom = "5.5rem";
      inputSubmitBox.style.marginBottom = "6rem";
    }
  });
};

function scrollToEndOfChat() {
  const { aiAdvicePage } = aiAdviceEls();

  aiAdvicePage.scroll({
    behavior: "smooth",
    top: aiAdvicePage.scrollHeight,
  });
}

export const getUserInputController = async () => {
  const { userInput, getAdviceBtn } = aiAdviceEls();
  userFocusIn_OutController();

  // **----- Controll style when user typing

  userInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
    this.style.maxHeight = `${180}px`;

    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);

    scrollToEndOfChat();
  });

  // **----- Send Prompt by Pressing Button
  getAdviceBtn.addEventListener("click", () => sendPrompt());

  // **----- Send Prompt by Pressing Enter
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendPrompt();
    }
  });

  // ***-------   Send task to AI chat from task list
  if (taskToAssistant.get().length !== 0)
    givenTaskTo_AssistantController(userInput, getAdviceBtn);
};

// ***---------        Send task to assitant controller
const givenTaskTo_AssistantController = (userInputEl, getAdviceBtn) => {
  userInputEl.value = `Act as project manager for my this task:
  title: ${taskToAssistant.get()[0].title}
  description: ${taskToAssistant.get()[0].description}
  start time: ${new Date(
    taskToAssistant.get()[0].startDateTime
  ).toLocaleString()},
  duration minutes: ${taskToAssistant.get()[0].duration}m`;
  getAdviceBtn.disabled = false;
};

const sendPrompt = () => {
  const { aiAdvicePage, userInput, getAdviceBtn } = aiAdviceEls();

  if (userInput.value.trim() === "") return;

  removeLocalStorage("task-to-assistant");
  renderAdviceInHtml(userInput.value);

  userInput.value = "";
  getAdviceBtn.disabled = true;
  userInput.style.height = `min-content`;
  aiAdvicePage.style.cssText += `align-content: start;`;

  scrollToEndOfChat();
};

const renderAdviceInHtml = async (userInput) => {
  const { chatArea } = aiAdviceEls();

  if (!findActiveConversation(activeConversation_Id.get())) createNewConve();

  const userSpan = document.createElement("span");
  userSpan.classList.add("user");
  userSpan.textContent = userInput.trim();

  const aiAdviceOutput = document.createElement("article");
  aiAdviceOutput.className = "ai-advice-output markdown-body";
  aiAdviceOutput.style.cssText += `
  background-color: #0a0a0a;
  color: #f8f8f8;
  `;

  chatArea.appendChild(userSpan);
  chatArea.innerHTML += loadingDivComp();
  chatArea.appendChild(aiAdviceOutput);

  let fullMarkdown = "";
  const loadingDiv = document.querySelectorAll(".loading-div");

  try {
    // Add user input
    findActiveConversation(activeConversation_Id.get()).messages.push({
      role: "user",
      content: userInput.trim(),
    });

    if (
      findActiveConversation(activeConversation_Id.get()).messages.length === 2
    )
      renderWelcomeMessage(false);

    const response = await getAdvice(
      findActiveConversation(activeConversation_Id.get()).messages
    );

    // **---------     For streaming response
    for await (const part of response) {
      fullMarkdown += part?.text;

      const htmlContent = converter.makeHtml(fullMarkdown);
      aiAdviceOutput.innerHTML = htmlContent;
      scrollToEndOfChat(true);
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

    chatArea.innerHTML += chatErrorCompo(err);
  }

  addCopyButtonsToCodeBlocks();
  highlightCode();
};

function addCopyButtonsToCodeBlocks() {
  const { aiAdviceOutput } = aiAdviceEls();
  if (!aiAdviceEls) return;

  aiAdviceOutput.querySelectorAll("pre code").forEach((codeBlock) => {
    // Avoid adding multiple buttons
    if (codeBlock.parentElement.querySelector(".copy-code-btn")) return;

    const div = document.createElement("div");
    div.className = "code-block-header";

    const span = document.createElement("span");
    span.className = "language-name";
    span.textContent = codeBlock.classList[0];

    const button = document.createElement("button");
    button.className = "copy-code-btn";
    button.innerHTML = `<i class="bi bi-clipboard"></i>Copy code`;

    button.addEventListener("click", () => {
      navigator.clipboard.writeText(codeBlock.textContent);
      button.textContent = "Copied!";
      setTimeout(
        () => (button.innerHTML = `<i class="bi bi-clipboard"></i>Copy code`),
        1500
      );
    });

    div.appendChild(span);
    div.appendChild(button);

    codeBlock.parentElement.style.cssText += `
    position: relative; padding-top: 2rem;`;
    codeBlock.parentElement.appendChild(div);
  });
}

const addStyleToActiveConve = (id) => {
  const { conversations } = aiAdviceEls();

  conversations.forEach((conveEl) => {
    const conveElDataId = conveEl.getAttribute("data-id");

    conveElDataId === id
      ? conveEl.classList.add("active__conver")
      : conveEl.classList.remove("active__conver");
  });
};

export const renderActiveConve_Messages = (id) => {
  const { chatArea } = aiAdviceEls();

  chatArea.innerHTML = "";

  if (
    !findActiveConversation(id) ||
    findActiveConversation(id).messages.length === 1
  )
    renderWelcomeMessage(true);

  findActiveConversation(id).messages.forEach((message) => {
    if (message.role === "user") {
      const userSpan = document.createElement("span");
      userSpan.classList.add("user");
      userSpan.textContent = message.content;

      chatArea.appendChild(userSpan);
    }

    if (message.role === "assistant") {
      const aiAdviceOutput = document.createElement("article");
      aiAdviceOutput.className = "ai-advice-output markdown-body";
      aiAdviceOutput.style.cssText += `
      background-color: #0a0a0a;
      color: #f8f8f8;
      `;

      chatArea.appendChild(aiAdviceOutput);
      aiAdviceOutput.innerHTML = converter.makeHtml(message.content);
    }
  });

  addCopyButtonsToCodeBlocks();
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

  if (document.startViewTransition)
    document.startViewTransition(() => {
      renderConversationList();
      addStyleToActiveConve(activeConversation_Id.get());
      renderActiveConve_Messages(activeConversation_Id.get());
    });
  else {
    renderConversationList();
    addStyleToActiveConve(activeConversation_Id.get());
    renderActiveConve_Messages(activeConversation_Id.get());
  }
};

export const renderConversationList = () => {
  const { conversationList } = aiAdviceEls();
  conversationList.innerHTML = "";

  if (conversations.get().length === 0)
    conversationList.innerHTML = `<h5 align="center">No Conversation Exist! <br> Time to start new conversation</h5>`;

  conversations.get().forEach((conversation) => {
    conversationList.innerHTML += conveListCompo(conversation);
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
  const { chatArea, welcomeMessage } = aiAdviceEls();

  show_Welcome
    ? (chatArea.innerHTML = welcomeMessageCompo())
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
