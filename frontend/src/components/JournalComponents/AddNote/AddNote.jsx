import React, { useState } from "react";
import axios from "axios";
import "./AddNote.css";
import Button from "../../Button/Button";
import MoodSummary from "../MoodSummary/MoodSummary";

const AddNote = ({ handleAddNote, notes }) => {
  const [noteText, setNoteText] = useState("");
  // const [error, setError] = useState(null);
  const characterLimit = 300;

  const handleChange = (event) => {
    if (characterLimit - event.target.value.length >= 0)
      setNoteText(event.target.value);
    else console.log("Character limit reached");
  };

  const analyzeMood = async (event) => {
    // setError(null); // Reset error state
    if (noteText.trim().length > 0) {
      handleAddNote(noteText);
      setNoteText("");
    }
    // event.preventDefault();

    const data = { "entry": noteText };
    // TODO: add a loading spinner since there is a time-delay
    try {
      const response = await axios.post("http://127.0.0.1:5000/mood", data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(response);

      if (response.ok) {
        console.log("Response is OK");
      } else {
        console.log("Response is not OK");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // const handleSaveClick = (event) => {
  //   if (noteText.trim().length > 0) {
  //     handleAddNote(noteText);
  //     analyzeMood();
  //   }
  //   event.preventDefault();
  // };

  return (
    <div className="new-note-container">
      <MoodSummary notes={notes} />
      <div className="journal-page-header">
        Embrace Your Emotions with aibo Notes
      </div>
      <div className="new-note">
        <textarea
          placeholder="Tell me about your day..."
          rows="10"
          cols="10"
          value={noteText}
          onChange={handleChange}
        ></textarea>
        <div className="note-footer">
          <small>{characterLimit - noteText.length} Characters Remaining</small>
          <Button className="save-button" label="Save" callback={analyzeMood} />
        </div>
      </div>
    </div>
  );
};

export default AddNote;
