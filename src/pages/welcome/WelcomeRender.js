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

    <section>
    </section>

  </div>

  <div class="copyRight">
    <p>Copyright © 2025 Taskly</p>
  </div>
   `;
};
export default WelcomeRender;
