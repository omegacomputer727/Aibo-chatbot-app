import React from "react";
import "./Navbar.css";

import { useSession, useSessionContext } from "@supabase/auth-helpers-react";

import UserIcon from "../UserIcon/UserIcon";
import Circles from "../Circles/Circles";

function Navbar() {
  const session = useSession(); // tokens
  const { isLoading } = useSessionContext();

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  console.log(session);

  return (
    <div>
      <UserIcon />
      <Circles />
      <span className="helpline">Emergency Helpline: +91 9152987821</span>
    </div>
  );
}

export default Navbar;
