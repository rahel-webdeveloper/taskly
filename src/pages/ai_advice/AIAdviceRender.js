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

  <span id="sidebar_toggle-btn">
  <i class="bi bi-chevron-double-right"></i>
  </span>

  <div id="ai__sidebar">
    <div class="chat__Library">
      <header class="library__header">
       <h2>Library</h2>
       <span><i class="bi bi-pencil-square"></i></span>
      </header>
      <div class="library__contents">
        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>

        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>

        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>

        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>


        <div class="content">
          <h4 class="user__msg">What is streaming in AI response!</h4>
          <p class="assistant__res">
            It is the of generating response as it generated may be one letter...
          </p>

          <span>
            <i class="bi bi-clock"></i>2d
          </span>
        </div>
      </div>
    </div>
  </div>`;
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
