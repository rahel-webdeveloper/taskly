const AIAdviceContainer = () => {
  return `
    <div class="ai-advice_container">
    ${aiSidebarComp()}
      <div id="chat_area">
      
      </div>
      <div class="input-submit_box">
        <textarea cols="1" rows="1" id="user-input" placeholder="Enter your task or question"></textarea>
        <button id="get-advice_btn" disabled><i class="bi bi-arrow-up-circle-fill"></i></button>
      </div>
    </div>
  `;
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
  <li class="conversation" view-transition-name="conve-${conve.id}">
    <h4>${conve.title}</h4>
    <p>It is the of generating response as it generated may be one letter...</p>
    <span>
      <i class="bi bi-clock"></i>2d
    </span>
  </li>`;
};

export const welcomeMessageComp = () => {
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

export default AIAdviceContainer;
