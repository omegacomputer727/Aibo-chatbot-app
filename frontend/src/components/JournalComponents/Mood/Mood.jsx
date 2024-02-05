import React from "react";
import "./Mood.css";

function Mood({ date, mood }) {
  let image, color;

  if (mood < 3) {
    color = "red";
    image = "/images/sad.png";
  } else if (mood >= 3 && mood < 7) {
    color="orange";
    image = "/images/neutral.png";
  } else {
    color="red";
    image = "/images/happy.png";
  }

  return (
    <div className="mood">
      <div className={"mood-circle tooltip " + color}>
        <img src={image} alt="mood" className="mood-image"/>
        <span class="tooltiptext">Score: {mood.toFixed(2)}</span>
      </div>
      <div className="day">{date.substr(0, 3)}</div>
    </div>
  );
}

export default Mood;
