import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import setProgress from "../../actions/usericonAction";
import "./Event.css";
import { useSession, useSessionContext } from "@supabase/auth-helpers-react";
import Notification from "../Notification/Notification";

function Event({ event }) {
  const progress = useSelector((state) => state.progress);
  console.log(progress);
  const [notification, setNotification] = useState(null);
  // const [progress, setProgress] = useState(
  //   localStorage.getItem("progress") || "0"
  // );
  const dispatch = useDispatch();
  const session = useSession(); // tokens
  const { isLoading } = useSessionContext();

  // useEffect(() => {
  //   console.log("progress: ", progress);
  //   localStorage.setItem("progress", progress);
  // }, [progress]);

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  // Close the notification
  const closeNotification = () => {
    setNotification(null);
  };

  // dynamic changing
  let remainingDays = event.description.split(",")[1];
  console.log("remaining days: ", remainingDays);

  async function deleteCalendarEvent() {
    const eventId = event.id;
    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events/" +
        eventId,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
      }
    ).then((data) => {
      console.log(data);
      dispatch(setProgress());
      // setProgress((Number(progress) + 20).toString());
      // console.log("progress : ", progress);
      setNotification("Calendar event deleted.");
    });
  }

  return (
    <div>
      <div class="event-card">
        <div class="card-header">
          <span>{event.summary}</span>
          <button
            className="task-done"
            onClick={() => {
              deleteCalendarEvent();
            }}
          >
            Done
          </button>
        </div>
        <div class="card-body">
          {remainingDays}
          {remainingDays > 1 ? <span> days left</span> : <span> day left</span>}
        </div>
      </div>
      {notification && (
        <Notification message={notification} onClose={closeNotification} />
      )}
    </div>
  );
}

export default Event;
