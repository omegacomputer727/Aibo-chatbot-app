import React from "react";
import "./Circle.css";

const Circle = ({ icon, onClick }) => {
  return (
    <div className="circle" onClick={onClick}>
      {icon}
    </div>
  );
};

export default Circle;
