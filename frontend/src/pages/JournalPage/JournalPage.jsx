import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import JournalList from "../../components/JournalComponents/JournalList/JournalList";
import Search from "../../components/JournalComponents/Search/Search";
import AddNote from "../../components/JournalComponents/AddNote/AddNote";
import "./JournalPage.css";

import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../HomePage/HomePage";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

function JournalPage() {
  const notes_data = localStorage.getItem("user_notes");
  const [notes, setNotes] = useState(
    JSON.parse(notes_data) || [
      {
        id: nanoid(),
        text:
          "i got yelled at work today, i feel like nobody appreciates me for my hardwork",
        date: "9/14/2023",
      },
    ]
  );

  useEffect(() => {
    localStorage.setItem("user_notes", JSON.stringify(notes));
  }, [notes]);

  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [notification, setNotification] = useState(null);
  const session = useSession(); // tokens
  const supabase = useSupabaseClient();
  const { isLoading } = useSessionContext();

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  // Close the notification
  const closeNotification = () => {
    setNotification(null);
  };

  async function signOut() {
    await supabase.auth.signOut();
    setNotification("Signed out successfully.");
  }

  const handleSearchDate = (date) => {
    setSearchDate(date);
  };

  const addNote = (text) => {
    const date = new Date();
    // sentiment analysis done here and added with the note history
    const newNote = {
      id: nanoid(),
      text: text,
      date: date.toLocaleDateString(),
    };
    const newNotes = [...notes, newNote];
    setNotes(newNotes);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  return (
    <div className="journal-page">
      {session ? (
        <>
          <Navbar />
          <Button label="Sign Out" callback={signOut} />
          <div className="container">
            {/* <Header /> */}
            <div className="search-box">
              <Search
                handleSearchNote={setSearchText}
                handleSearchDate={handleSearchDate}
              />
            </div>
            <div className="left-column-jor">
              <JournalList
                notes={notes.filter((note) => {
                  const textMatch = note.text
                    .toLowerCase()
                    .includes(searchText);
                  const dateMatch =
                    searchDate === "" ||
                    note.date === searchDate ||
                    note.date.includes(searchDate);
                  return textMatch && dateMatch;
                })}
                handleDeleteNote={deleteNote}
              />
            </div>
            <div className="right-column-jor">
              <AddNote handleAddNote={addNote} notes={notes} />
            </div>
          </div>
        </>
      ) : (
        <HomePage />
      )}
      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}
    </div>
  );
}

export default JournalPage;
