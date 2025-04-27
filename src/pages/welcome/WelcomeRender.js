const WelcomeRender = () => {
  return `
  <div class="welcome-page">
    <section class="welcome-first_section">
      <h1>Welcome to Taskly</h1>
      <div class="first-page_subtitle"> 
      <h2><span>Track</span>, <span>Chat</span>, and <span>Conquer</span> Your Tasks!</h2>

      <p>Master your to-dos with smart tracking and instant AI advice! Our platform offers a suite of advanced task tracking and instant AI tools.!</p>
      </div>

      <div class="welcome-btns">
       <a href="#see_how-it-works">
        <button id="how-works_btn">
         <i class="bi bi-play"></i> See How It Works 
        </button>
       </a>
       <a href="/ai-advisor">
        <button id="get_started_btn">
         <i class="bi bi-stars"></i> Get Started Chat
        </button>
       </a>
      </div>

      <div class="dash-img_div">
      <img src="/Task Hub Screenshot.png" class="dash-screenshot_img" />
      <img src="/Dashboard Screenshot.png" class="dash-screenshot_img" />

      </div>

    </section>

    <section>
    </section>

  </div>

  <div class="copyRight">
    <p>Copyright © 2025 TaskTracker</p>
  </div>
   `;
};
export default WelcomeRender;
