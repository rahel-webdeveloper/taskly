import "highlight.js/styles/atom-one-dark.css";
import loadingDivComp from "../../components/Loading.js";
import { conveListCompo, welcomeMessageCompo } from "./AIAdviceRender";

import {
  loadLocalStorage,
  removeLocalStorage,
  saveLocalStorage,
} from "../../data/localStorage";
import { taskToAssistant } from "../../tasks/store";
import {
  activeConversation_Id,
  conversations,
  converter,
  deleteConversation,
  findActiveConversation,
  generateAdvice,
  highlightCode,
  systemMsg,
} from "./store";

export const AIAdviceLogic = () => {
  userInputBoxEvents();
  onReloadAIPageController();
  renderConversationList();
};

export const aiAdviceEls = () => {
  const aiAdvicePage = document.querySelector(".ai-advice_page");
  const inputSubmitBox = document.querySelector(".input-submit_box");
  const sidebarMenu = document.getElementById("sidebar_menu");
  const getAdviceBtn = document.getElementById("get-advice_btn");
  const userInput = document.getElementById("user-input");
  const chatArea = document.getElementById("chat_area");
  const loadingDiv = document.querySelectorAll(".loading-div");
  const aiAdviceOutput = document.querySelectorAll(".ai-advice-output");
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
  sendTaskTo_Assistant();

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
    // Hide AI sidebar if event was out of sidebar
    toggleAiSideBar(false);

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
  const aiSideBarStyle = aiSideBar.style;

  if (!aiSideBar) return;

  show ? (aiSideBarStyle.left = "50%") : (aiSideBarStyle.left = "-50%");
};

const userInputBoxEvents = () => {
  const { userInput, getAdviceBtn } = aiAdviceEls();

  userInput.addEventListener("input", userInputBoxUI);

  userInput.addEventListener("focusin", userInputBoxUI);

  userInput.addEventListener("focusout", userInputBoxUI);

  userInput.addEventListener("keydown", userInputBoxUI);

  window.addEventListener("resize", userInputBoxUI);

  getAdviceBtn.addEventListener("click", userInputBoxUI);
};

function userInputBoxUI(event) {
  const { aiAdvicePage, inputSubmitBox, sidebarMenu, getAdviceBtn, userInput } =
    aiAdviceEls();

  if (!aiAdvicePage) return;

  const isWindowLarge = window.innerWidth > 1024;

  if (event.type === "input") {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;
    this.style.maxHeight = `${180}px`;

    this.value
      ? (getAdviceBtn.disabled = false)
      : (getAdviceBtn.disabled = true);

    scrollToEndOfChat();
  }

  if (event.type === "focusin") {
    this.style.height = "auto";
    this.style.height = `${this.scrollHeight}px`;

    aiAdvicePage.style.paddingBottom = `${isWindowLarge ? "2.5rem" : "1.3rem"}`;
    sidebarMenu.style.scale = `${!isWindowLarge ? "0" : "1"}`;
    inputSubmitBox.style.marginBottom = `${isWindowLarge ? "3rem" : "1.5rem"}`;

    scrollToEndOfChat();
  }

  if (event.type === "focusout") {
    // if User value was true then focus out should not work
    if (!this.value) {
      aiAdvicePage.style.paddingBottom = `${
        !isWindowLarge ? "5.5rem" : "2.5rem"
      }`;
      sidebarMenu.style.scale = "1";
      inputSubmitBox.style.marginBottom = `${isWindowLarge ? "3rem" : "6rem"}`;
    }
  }

  // if (event.type === "keydown") {
  //   if (event.key === "Enter" && !event.shiftKey) {
  //     event.preventDefault();
  //     sendPrompt();

  //     userInput.value = "";
  //     getAdviceBtn.disabled = true;
  //     userInput.style.height = `min-content`;
  //     aiAdvicePage.style.cssText += `align-content: start;`;
  //   }
  // }

  if (event.type === "resize") {
    sidebarMenu.style.scale = "1";

    if (isWindowLarge) {
      aiAdvicePage.style.paddingBottom = "2.5rem";
      inputSubmitBox.style.marginBottom = "3rem";
    } else {
      aiAdvicePage.style.paddingBottom = "5.5rem";
      inputSubmitBox.style.marginBottom = "6rem";
    }
  }

  if (event.type === "click" && event.target.closest("#get-advice_btn")) {
    sendPrompt();

    userInput.value = "";
    getAdviceBtn.disabled = true;
    userInput.style.height = `min-content`;
    aiAdvicePage.style.cssText += `align-content: start;`;
    aiAdvicePage.style.paddingBottom = `${
      !isWindowLarge ? "5.5rem" : "2.5rem"
    }`;
    sidebarMenu.style.scale = "1";
    inputSubmitBox.style.marginBottom = `${isWindowLarge ? "3rem" : "6rem"}`;
  }
}

export function scrollToEndOfChat() {
  const { aiAdvicePage } = aiAdviceEls();

  aiAdvicePage.scroll({
    behavior: "smooth",
    top: aiAdvicePage.scrollHeight,
  });
}

// ***---------        Send task to assitant controller
const sendTaskTo_Assistant = () => {
  const { userInput, getAdviceBtn } = aiAdviceEls();

  const task = taskToAssistant.get()[0];
  if (task && userInput) {
    userInput.value =
      `Hi AI Assistant, I need help with this task:\n` +
      `Title: ${task.title}\n` +
      `Description: ${task.description}\n` +
      `Category: ${task.category}\n` +
      `Priority: ${task.prioritylevel}\n` +
      `Status: ${task.status}\n` +
      `Start Time: ${new Date(task.startTime).toLocaleString()}\n` +
      `Due Time: ${new Date(task.dueTime).toLocaleString()}\n` +
      `Duration: ${task.duration} minutes\n` +
      `\nCan you suggest ways to complete this task efficiently, break it into subtasks, or provide tips based on its priority and category?`;

    getAdviceBtn.disabled = false;
  }
};

const sendPrompt = () => {
  const { userInput } = aiAdviceEls();

  if (userInput.value.trim() === "") return;

  removeLocalStorage("task-to-assistant");
  renderAdviceInHtml(userInput.value);
  scrollToEndOfChat();
};

const renderAdviceInHtml = (userInput) => {
  const { chatArea } = aiAdviceEls();

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

  generateAdvice();
  renderWelcomeMessage(false);
};

export const detectDirection = (text, rtlThreshold = 0.25) => {
  if (!text || typeof text !== "string")
    return { dir: "ltr", align: "left", rtlRatio: 0 };

  // Arabic-script Unicode blocks (covers Arabic, Persian, Urdu, etc.)
  const rtlRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;

  // Count RTL characters
  const rtlMatches = (text.match(rtlRegex) || []).length;

  // Count total characters
  const totalChars = (text.match(/\p{L}/gu) || []).length;

  if (totalChars === 0) return { dir: "ltr", align: "left", rtlRatio: 0 };

  const rtlRatio = rtlMatches / totalChars;
  const isRtl = rtlRatio > rtlThreshold;

  return {
    dir: isRtl ? "rtl" : "ltr",
    align: isRtl ? "right" : "left",
    rtlRatio,
  };
};

export function addCopyButtonsToCodeBlocks() {
  const { aiAdviceOutput } = aiAdviceEls();
  if (!aiAdviceEls) return;

  aiAdviceOutput.forEach((output) => {
    output.querySelectorAll("pre code").forEach((codeBlock) => {
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
  });
}

export const addStyleToActiveConve = (id) => {
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
      const { dir, align } = detectDirection(message.content);

      const aiAdviceOutput = document.createElement("article");
      aiAdviceOutput.className = "ai-advice-output markdown-body";
      aiAdviceOutput.style.cssText += `
      background-color: #0a0a0a;
      color: #f8f8f8;
      direction: ${dir};
      text-align: ${align};
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

export const createNewConve = () => {
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

  if (conversations.get()[0].messages.length <= 2)
    conversationList.querySelectorAll("li")[0].style.display = "none";
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
      ? conversation?.messages[2].content.slice(0, 85)
      : "Not answared this question"
  }`;

  return { userMessage, assistantMessage };
}

export const renderWelcomeMessage = (show_Welcome) => {
  const { chatArea, welcomeMessage } = aiAdviceEls();

  show_Welcome
    ? (chatArea.innerHTML = welcomeMessageCompo())
    : welcomeMessage?.remove();
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
