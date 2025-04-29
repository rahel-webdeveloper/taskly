const AIAdviceRender = () => {
  return `
    <div class="ai-advice_container">
      <article id="response-area" class="markdown-body">
      </article>
      <div class="input-submit_box">
        <textarea cols="1" rows="1" id="user-input" placeholder="Enter your task or question"></textarea>
        <button id="get-advice_btn" disabled><i class="bi bi-arrow-up-circle-fill"></i></button>
      </div>
    </div>
  `;
};

export const welcomeMessageRender = () => {
  return ` 
  <div class="ai-welcome_message">
  <span class="smile-icon"><i class="bi bi-emoji-heart-eyes-fill"></i></span>
    <h1 class="welcome-header" style="border-bottom: none; font-size: 2.7rem">Your Personal <br> AI Advisor!</h1>
    <p>Get started by Script a task and Chat can do the rest. Not sure where to start?</p>
  </div>`;
};

export const loadingDiv = () => {
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

export default AIAdviceRender;
