import React from "react";
import { useState } from "react";
import "./HomePage.css";

import Navbar from "../../components/Navbar/Navbar";
import Notification from "../../components/Notification/Notification";
import Login from "../../components/Login/Login";
import Button from "../../components/Button/Button";

import { Link } from "react-router-dom";
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

function HomePage() {
  // eslint-disable-next-line
  const [heroUrl, setHeroUrl] = useState(
    localStorage.getItem("heroUrl") || "/images/aibo.png"
  );

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

  async function googleSignIn() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar",
      },
    });
    if (error) {
      setNotification("Error logging into Google provider.");
      console.log(error);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setNotification("Signed out successfully.");
  }

  console.log(session);

  return (
    <div className="App">
      {session ? (
        <>
          <Navbar />
          <Button label="Sign Out" callback={signOut} />
          <div className="main-content">
            <div className="left">
              <h1 className="title">
                hi {session.user.user_metadata.name.split(" ")[0].toLowerCase()}{" "}
                :D
              </h1>
              <span className="subtitle">
                i can't wait to have a chat <br /> with you today!
              </span>
              <br />
              <Link to="/chat">
                <button data-hover="Let's go!" className="white-button">
                  <div>Talk with Aibo</div>
                </button>
              </Link>
            </div>
            <div className="right">
              <img src={heroUrl} alt="aibo" />
            </div>
          </div>
        </>
      ) : (
        <>
          <Login googleSignIn={googleSignIn} />
        </>
      )}
      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}
    </div>
  );
}

export default HomePage;
