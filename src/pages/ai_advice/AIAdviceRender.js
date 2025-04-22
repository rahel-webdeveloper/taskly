const AIAdviceRender = () => {
  return `
    <div class="ai-advice_container">
      <article id="response-area" class="markdown-body">
       ${welcomeMessageRender()}
      </article>
      <div class="input-submit_box">
        <input id="user-input" placeholder="Enter your task or question"></input>
        <button id="get-advice_btn" disabled><i class="bi bi-arrow-up-circle-fill"></i></button>
      </div>
    </div>
  `;
};

const welcomeMessageRender = () => {
  return ` 
  <div class="ai-welcome_message">
    <img src="/public/Taskly-logo.webp" />
    <h3>Hi, I'm Taskly!</h3>
    <p>How can I help you today?</p>
  </div>`;
};

export default AIAdviceRender;
