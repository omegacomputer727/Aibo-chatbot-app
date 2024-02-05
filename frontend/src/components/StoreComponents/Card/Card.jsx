import React from "react";
import "./Card.css";
import { useSelector } from "react-redux";

function Card({
  imageSrc,
  title,
  levelRequired,
  onEquipClick,
  isCurrentlyEquipped,
  onRemoveItem,
}) {
  const progress = useSelector((state) => state.progress);
  const level = Math.floor(progress / 100).toString();

  console.log(title, ": ", isCurrentlyEquipped);

  return (
    <div className="card">
      <img src={imageSrc} alt={title} />
      <br />
      <span>{title}</span>
      <p>Unlocks at level: {levelRequired}</p>
      {level >= levelRequired ? (
        isCurrentlyEquipped ? (
          <button className="remove" onClick={onRemoveItem}>
            Remove
          </button>
        ) : (
          <button className="available" onClick={onEquipClick}>
            Equip Item
          </button>
        )
      ) : (
        <button className="unavailable" disabled>
          Not Available
        </button>
      )}
    </div>
  );
}

export default Card;
