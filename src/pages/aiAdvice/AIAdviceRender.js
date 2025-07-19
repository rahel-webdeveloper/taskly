import { AIAdviceLogic, eventsHandler, toggleAiSideBar } from "./AIAdviceLogic";

const AIAdviceContainer = () => {
  return `
    <div class="ai-advice_container">
    ${aiSidebarComp()}
      <div id="chat_area">
      
      </div>
      <div class="input-submit_box">
        <textarea cols="1" rows="1" id="user-input" placeholder="Enter your task or question"></textarea>
        <button id="get-advice_btn" disabled><i class="bi bi-send-fill"></i></button>
      </div>
    </div>
  `;
};

AIAdviceContainer.init = function () {
  const aiAdviceCotainer = document.querySelector(".ai-advice_container");

  aiAdviceCotainer?.removeEventListener("click", eventsHandler);
  aiAdviceCotainer?.addEventListener("click", eventsHandler);

  window.addEventListener("resize", () => toggleAiSideBar(false));

  AIAdviceLogic();
};

const aiSidebarComp = () => {
  return `

  <div class="sidebar-tggle__new-chat">
    <span id="sidebar_show-btn">
    <i class="bi bi-window-sidebar"></i>
    </span>
    <span id="new_chat"><i class="bi bi-escape"></i></span>
  </div>

  <div id="ai__sidebar">
    <div class="conversation__Library">
      <header class="library__header">
       <h2>Library</h2>
       <span id="sidebar_hide-btn">
    <i class="bi bi-window-x"></i>
    </span>
      </header>

      <ul class="conversation__list" id="conversation__list" view-transition-name="conversation-list">
      
      </ul>
    </div>
  </div>`;
};

export const conveListCompo = (conve) => {
  return `
  <li class="conversation" data-id="${conve.id}" view-transition-name="conve-${
    conve.id
  }">
    <h4 data-id="${conve.id}">${
    conve.messages.length === 1
      ? "No message sended!"
      : conve.messages[1].role === "user"
      ? conve.messages[1].content.slice(0, 35)
      : ""
  }</h4>
    <p data-id="${conve.id}">${
    conve.messages.length === 1
      ? conve.title
      : conve.messages[2].content.slice(0, 85)
  }</p>
    <span data-id="${conve.id}">
      <i class="bi bi-clock"></i>${new Date(conve.createdAt).toLocaleString()}
    </span>
  </li>`;
};

export const welcomeMessageCompo = () => {
  return ` 
  <div class="ai-welcome_message">
  <span class="smile-icon"><i class="bi bi-emoji-heart-eyes-fill"></i></span>
    <h1 class="welcome-header" style="border-bottom: none; font-size: 2.7rem">Your Personal <br> AI Advisor!</h1>
    <p>Get started by Script a task and Chat can do the rest. Not sure where to start?</p>
  </div>`;
};

export const loadingDivComp = () => {
  return `
    <div class="think-div" id="think-div">
      <div class="loader">
       <li class="ball"></li>
       <li class="ball"></li>
       <li class="ball"></li>
      </div>
    </div>
  `;
};

export const chatErrorCompo = (err) => {
  return `
  <div class="catch-error">
    <i class="bi bi-exclamation-circle"></i>
    <span>
      ${
        err?.message === "puter is not defined"
          ? "Check your internet and try again!"
          : err?.error?.delegate == "usage-limited-chat"
          ? "Usage limit exceeded!"
          : " Something went wrong!"
      }
    </span>
  </div>`;
};

export default AIAdviceContainer;
