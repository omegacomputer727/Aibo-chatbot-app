import React from "react";
import Note from "../Note/Note";
import "./JournalList.css";

const JournalList = ({ notes, handleDeleteNote }) => {
  return (
    <div className="journal-list-container">
      <div className="journal-header">My Notes</div>
      <div className="journal-list">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              id={note.id}
              text={note.text}
              date={note.date}
              handleDeleteNote={handleDeleteNote}
            />
          ))
        ) : (
          <span className="empty-list-jor">
            nothing to see here,
            <br />
            add new notes
          </span>
        )}
      </div>
    </div>
  );
};

export default JournalList;
