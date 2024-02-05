import React from "react";
import "./Button.css";

function Button({label, callback}) {
    return (
      <div className={(label === "Sign Out") ? "button-container": ""}>
        <button className="submit" onClick={callback}>
          {label}
        </button>
      </div>
    );
}

export default Button;