import React from "react";
import "./UserIcon.css";
import { useSelector } from "react-redux";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";

const UserIcon = () => {
  const progress = useSelector((state) => state.progress);
  // const [progress, setProgress] = useState(
  //   localStorage.getItem("progress") || "0"
  // );
  const exp = Number(progress) % 100;
  const level = Math.floor(Number(progress) / 100).toString();

  console.log("progress: " + progress);
  console.log("exp: " + exp);
  console.log("level: " + level);

  const progressBarStyles = {
    width: `${exp}%`,
  };

  const session = useSession(); // tokens
  const { isLoading } = useSessionContext();

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="all">
      <a href="/" className="app-name">
        aibo.
      </a>
      <div className="user-icon">
        <div className="user-circle">
          <span className="initial">{level}</span>
        </div>
        <div className="info">
          <div className="progress-bar">
            <div className="progress-fill" style={progressBarStyles}></div>
          </div>
          <span className="username">
            {session.user.user_metadata.name.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserIcon;
