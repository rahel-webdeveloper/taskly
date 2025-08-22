const sendFeedbackComponent = () => {
  return `
       <div class="send-feedback-container">
       <div class="send-feedback_icon-div" id="feedback-icon-div">
       <span id="icon_div">Feedback<i class="bi bi-chat-dots-fill"></i></span>
      </div>
  
      <div class="get-feedback-form_div">
      <div class="feedback-header">
      <h3>Report a feedback</h3>
      <img src="/icons/Taskly-logo.webp" alt="Taskly logo" />
      </div>
  
       <form id="get-feedback-form">
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

export default sendFeedbackComponent;
