const WelcomeRender = () => {
  return `
  <div class="welcome-page">
    <section class="welcome-first_section">
      <h1>Welcome to Taskly</h1>
      <div class="first-page_subtitle"> 
      <h2><span>Track</span>, <span>Chat</span>, and <span>Conquer</span> Your Tasks!</h2>

      <p>Master your to-dos with smart tracking and instant AI advice! Our platform offers a suite of advanced task tracking and instant AI tools!</p>
      </div>

      <div class="welcome-btns">
       <a href="#see_how-it-works">
        <button id="how-works_btn">
         <i class="bi bi-play"></i> See How It Works 
        </button>
       </a>
       <a href="/">
        <button id="get_started_btn">
          Get Started Free <i class="bi bi-egg-fried"></i>
        </button>
       </a>
      </div>

      <div class="ai-advisor-annoucement_div">
      <div class="ai-annoucement-text-div">
      <h2>Transform your workflow with AI</h2>
      <p>No waiting, No guessing, Just smart, instant answers tailored to your needs-available anytime to help you make faster, better, and more confident decisions.</p>
      <a href="/ai-advisor"><button id="try-ai-advisor-btn">Try It Now <i class="bi bi-stars"></i></button></a>
      </div>

      <img src="/ai-advisor-img.png" class="advisor-annoucement-img" />
      </div>

      <div class="blur-shape"></div>

    </section>

  </div>


  <div class="copyRight">
    <p>Copyright © 2025 Taskly</p>
  </div>

  ${getSuggestionsComponent()}
   `;
};

export const getSuggestionsComponent = () => {
  return `
     <div class="send-suggesstions-container">
     <div class="get-suggestions_icon-div" id="feedback-icon-div">
     <span id="icon_div">Feedback<i class="bi bi-chat-dots-fill"></i></span>
    </div>

    <div class="get-suggestions-form_div">
    <div class="feedback-header">
    <h3>Report a feedback</h3>
    <img src="/public/Taskly-logo.webp" alt="Taskly logo" />
    </div>

     <form id="get-suggestions-form">
          <div class="name-block">
              <label for="user_name">Your Name</label>
              <input type="text" id="user_name" name="name" placeholder="enter your full name" required>
          </div>
  
          <div class="email-block">
              <label for="user_email">Your Email</label>
              <input type="email" id="user_email" name="email" placeholder="enter your email address" required>
          </div>
  
          <div class="message-block">
              <label for="user_message">Description</label>
              <textarea name="message" id="user_message" placeholder="What's feedback report? Do you have a suggesstion or it's bug?" rows="7" min="9" required></textarea>
          </div>
  
          <div class="form-action-btns">
          <button type="button" class="btn" id="cancel_btn">Cancel<i class="bi bi-x-circle"></i></button>
          <button type="submit" class="btn" id="send_btn">Send Feedback<i class="bi bi-send"></i></button>
          </div>
  
      </form>
    </div>
     </div>
    `;
};

export default WelcomeRender;
