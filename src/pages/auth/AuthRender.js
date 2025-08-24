import AuthLogic from "./AuthLogic";

const AuthRender = () => {
  return `
  <section class="auth ">
      
  </section>
  `;
};

AuthRender.init = function () {
  AuthLogic();
};

const imgUrl = new URL("/icons/Taskly-logo.webp", import.meta.url).href;

export const SignUpRender = () => {
  return `
     <div class="auth__container">
      <div class="auth__image">
        <img src="${imgUrl}" alt="Sign Up" width="120" 
  height="40" 
  loading="lazy" 
  />
      </div>
      <div class="auth__form">
        <div class="auth__header">
        <h2>Get started free</h2>
        <p>Free forever. No credit card needed.</p>
        </div>
        <form id="signup-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input placeholder="Enter your full name" type="text" id="name" name="name" required>
            <span class="error-msg">Name is required</span>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input placeholder="Enter your email address" type="email" id="email" name="email" required>
            <span class="error-msg">Enter a valid email</span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input placeholder="Enter your password" type="password" id="signup-password" name="password" required>
            <span class="show-password-icon signup-p"><i class="bi bi-eye-slash"></i></span>
            <span class="error-msg">Minimum 6 characters</span>
          </div>
          <button type="submit" id="signup-btn">Sign Up</button>
        </form>
        <p class="auth__toggle">Already have an account? <a href="/auth/sign-in" id="singin-link" data-navigo>Sign In</a></p>
      </div>
    </div> `;
};

export const SignInRender = () => {
  return `
  <div class="auth__container">
    <div class="auth__image">
      <img src="${imgUrl}" alt="Sign Up" />
    </div>
    <div class="auth__form">
      <div class="auth__header">
      <h2>Welcome back</h2>
      <p>Enter your details below.</p>
      </div>
      <form id="signin-form">
        <div class="form-group">
          <label for="signin-email">Email Address</label>
          <input placeholder="Enter your email address" type="email" id="signin-email" name="email" required>
            <span class="error-msg">Email is required</span>
        </div>
        <div class="form-group">
          <label for="signin-password">Password</label>
          <input placeholder="Enter your password" type="password" id="signin-password" name="password" required>
            <span class="show-password-icon signin-p"><i class="bi bi-eye-slash"></i></span>
            <span class="error-msg">Password is required</span>
        </div>
        <button type="submit" id="signin-btn">Sign In</button>
      </form>
      <p class="auth__toggle">Don't have an account? <a href="/auth/sign-up" data-navigo>Sign Up</a></p>
    </div>
  </div>
  `;
};

export const DeleteAccountRender = () => {
  return `
  <div class="auth__container">
    <div class="auth__image">
      <img src="${imgUrl}" alt="Sign Up" width="120" 
  height="40" 
  loading="lazy" 
   />
    </div>
    <div class="auth__form">
      <div class="auth__header">
      <h2>Deleting Account</h2>
      </div>
      <form id="remove-account-form">
        <div class="form-group">
          <label for="remove-account-password">Password</label>
          <input placeholder="Enter your password" type="password" id="remove-account-password" name="password" required>
            <span class="show-password-icon remove-account-p"><i class="bi bi-eye-slash"></i></span>
            <span class="error-msg">Password is required</span>
        </div>
      <p>Are you sure you want to delete your account? <br> This action cannot be undone.</p>
        <button type="submit" id="remove-account-btn">Yes, I want to delete.</button>
        </form>
        
        <button id="cancel-remove-btn">Cancel</button>
    </div>
  </div>
  `;
};
export default AuthRender;
