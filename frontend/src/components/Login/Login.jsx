import React, { useState } from "react";
import "./Login.css";

function Login({ googleSignIn }) {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="parent-div">
      <img className="aibo-logo" src="/logo.png" alt="aibo-logo" />
      <div className="login-container">
        <h1>Welcome to Aibo</h1>

        <label class="main">
          I agree to share my analysis data.
          <input type="checkbox" required />
          <span class="aibomark" />
        </label>

        <button
          data-hover="Go to homepage!"
          className="sign-in-button"
          onClick={googleSignIn}
        >
          <div>Log in with Google</div>
        </button>
      </div>
    </div>
  );
}

export default Login;
