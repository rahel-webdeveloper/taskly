export const SignUpRender = () => {
  return `
<section class="auth auth--signup">
    <div class="auth__container">
      <div class="auth__image">
        <img src="/path/to/signup-image.jpg" alt="Sign Up" />
      </div>
      <div class="auth__form">
        <h2>Create Your Account</h2>
        <form novalidate>
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
          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <input type="password" id="confirm-password" name="confirm-password" required>
            <span class="error-msg">Passwords must match</span>
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p class="auth__toggle">Already have an account? <a href="/sign-in" data-navigo>Sign In</a></p>
      </div>
    </div>
  </section>
`;
};

export const SignInRender = () => {
  return `
    <section class="auth auth--signin">
    <div class="auth__container">
      <div class="auth__image">
        <img src="/path/to/signin-image.jpg" alt="Sign In" />
      </div>
      <div class="auth__form">
        <h2>Welcome Back</h2>
        <form novalidate>
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
          <button type="submit">Sign In</button>
        </form>
        <p class="auth__toggle">Don't have an account? <a href="/sign-up" data-navigo>Sign Up</a></p>
      </div>
    </div>
  </section>
    `;
};
