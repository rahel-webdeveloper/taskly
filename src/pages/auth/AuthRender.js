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

const imgUrl = new URL("/Taskly-logo.webp", import.meta.url).href;

export const SignUpRender = () => {
  return `
     <div class="auth__container">
      <div class="auth__image">
        <img src="${imgUrl}" alt="Sign Up" />
        <h1>Taskly</h1>
      </div>
      <div class="auth__form">
        <h2>Create Your Account</h2>
        <form id="signup-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required>
            <span class="error-msg">Name is required</span>
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
            <span class="error-msg">Enter a valid email</span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
            <span class="error-msg">Minimum 6 characters</span>
          </div>
          <button type="submit">Sign Up</button>
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
        <h1>Taskly</h1>
    </div>
    <div class="auth__form">
      <h2>Welcome Back</h2>
      <form id="signin-form">
        <div class="form-group">
          <label for="signin-email">Email</label>
          <input type="email" id="signin-email" name="email" required>
            <span class="error-msg">Email is required</span>
        </div>
        <div class="form-group">
          <label for="signin-password">Password</label>
          <input type="password" id="signin-password" name="password" required>
            <span class="error-msg">Password is required</span>
        </div>
        <button type="submit" id="signin-btn">Sign In</button>
      </form>
      <p class="auth__toggle">Don't have an account? <a href="/auth/sign-up" data-navigo>Sign Up</a></p>
    </div>
  </div>
  `;
};

export default AuthRender;
