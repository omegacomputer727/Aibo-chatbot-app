import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "./ChatPage.css";

import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../HomePage/HomePage";
import Button from "../../components/Button/Button";
import Notification from "../../components/Notification/Notification";

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

function ChatPage() {
  const [notification, setNotification] = useState(null);

  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const chatHistoryRef = useRef(null);
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

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

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    // Add user message to chat history
    const newUserMessage = {
      text: message,
      user: true,
      timestamp: moment(new Date()).format("h:mm a"),
    };
    setChatHistory([...chatHistory, newUserMessage]);
    setMessage("");

    try {
      // Send message to Flask backend
      const response = await axios.post("http://127.0.0.1:5000/chatbot", {
        message,
      });
      const botMessage = response.data.Answer;

      // Add bot's response to chat history
      const newBotMessage = {
        text: botMessage,
        user: false,
        timestamp: moment(new Date()).format("h:mm a"),
      };
      setChatHistory((prevHistory) => [...prevHistory, newBotMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-page">
      {session ? (
        <>
          <Navbar />
          <Button label="Sign Out" callback={signOut} />
          {/* Chat Page */}
          <div className="chat-container">
            <div className="chat-history" ref={chatHistoryRef}>
              {chatHistory.map((entry, index) => (
                <div key={index}>
                  {/* User message */}
                  {entry.user && (
                    <div className="bubble right">
                      {/* <img src="user-avatar.png" alt="User Avatar" class="avatar"> */}
                      <img src="" alt="" className="avatar" />

                      <div className="message-details">
                        <div className="message-content">{entry.text}</div>
                        <div className="timestamp">{entry.timestamp}</div>
                      </div>
                    </div>
                  )}

                  {/* Bot message */}
                  {!entry.user && (
                    <div className="bubble">
                      {/* <img src="bot-avatar.png" alt="Bot Avatar" class="avatar"> */}
                      <img src="" alt="" className="avatar" />

                      <div className="message-details">
                        <div className="message-content">{entry.text}</div>
                        <div className="timestamp">{entry.timestamp}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form className="input-form" type="submit">
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={handleInputChange}
              />
              <button type="submit" onClick={handleSubmit}>
                Send
              </button>
            </form>
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

export default ChatPage;
