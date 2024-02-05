import React from "react";
import "./Circles.css";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { FaShoppingCart, FaClock, FaStickyNote } from "react-icons/fa";

function Circles() {
  const currentRoute = useLocation().pathname.toLowerCase();
  return (
    <div className="circle-container">
      <div className="circle1 tooltip-nav">
        <Link
          to="/journal"
          className={
            currentRoute.includes("journal") ? "circle active" : "circle"
          }
        >
          <FaStickyNote className="icon" />
        </Link>
        <span class="tooltiptext-nav">Notes</span>
      </div>
      <div className="circle2 tooltip-nav">
        <Link
          to="/planner"
          className={
            currentRoute.includes("planner") ? "circle active" : "circle"
          }
        >
          <FaClock className="icon" />
        </Link>
        <span class="tooltiptext-nav">Planner</span>
      </div>
      <div className="circle3 tooltip-nav">
        <Link
          to="/store"
          className={
            currentRoute.includes("store") ? "circle active" : "circle"
          }
        >
          <FaShoppingCart className="icon" />
        </Link>
        <span class="tooltiptext-nav">Store</span>
      </div>
    </div>
  );
}

export default Circles;
