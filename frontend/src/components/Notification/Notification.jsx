import React from "react";
import "./Notification.css";

function Notification({ message, onClose }) {
  return (
    <div className="notification">
      <div className="message">{message} </div>
      <button className="close-button" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default Notification;
