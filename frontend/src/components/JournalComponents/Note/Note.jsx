import React from "react";
import "./Note.css";
import { MdDeleteForever } from "react-icons/md";

const Note = ({ id, text, date, handleDeleteNote }) => {
  return (
    <div>
      <div className="note">
        <span className="note-content">{text}</span>
        <div className="note-footer">
          <small>{date}</small>
          <MdDeleteForever
            onClick={() => handleDeleteNote(id)}
            className="delete-icon"
            size="1.5em"
          />
        </div>
      </div>
      <div className="gap"></div>
    </div>
  );
};

export default Note;
