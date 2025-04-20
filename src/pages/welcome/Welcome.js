const Welcome = () => {
  return `
  <div class="welcome-page">
    <section class="welcome-first_section">
      <h1>Welcome to Taskly</h1>
      <div class="first-page_subtitle"> 
      <h2><span>Track</span>, <span>Chat</span>, and <span>Conquer</span> Your Tasks!</h2>

      <p>Master your to-dos with smart tracking and instant AI advice</p>
      </div>

      <div class="welcome-btns">
       <a href="#get-started_free">
        <button id="get_started_btn">
         <i class="bi bi-play"></i> Get Started Free 
        </button>
       </a>
       <a href="#how-it_works">
        <button id="how-works_btn">
         <i class="bi bi-snow"></i> See How It Works
        </button>
       </a>
      </div>

      <div class="dash-img_div">
      <img src="/public/Screenshot 2025-04-16 125640.png" class="dash-screenshot_img" />

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
export default Welcome;
