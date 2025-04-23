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

const imgUrl = new URL("/Taskly-logo.webp", import.meta.url).href;

export const welcomeMessageRender = () => {
  return ` 
  <div class="ai-welcome_message">
    <img src="${imgUrl}" />
    <h2>Your Personal AI Advisor Taskly!🤩</h2>
    <p>Get started by Script a task and Chat can do the rest. Not sure where to start?</p>
  </div>`;
};

export default AIAdviceRender;
