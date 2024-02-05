import React, { useEffect, useState } from "react";
import Event from "../Event/Event";
import "./Events.css";

import { useSession, useSessionContext } from "@supabase/auth-helpers-react";

function Events() {
  const [events, setEvents] = useState([]);

  const session = useSession(); // tokens
  const { isLoading } = useSessionContext();

  // no more flickering when we refresh the website
  if (isLoading) {
    return <></>;
  }

  useEffect(() => {
    const getEvents = async () => {
      console.log("Fetching calendar events");
      const evs = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + session.provider_token,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // console.log(data);
          if (data.items) {
            return data.items.filter((item) => item.summary.includes("Refill"));
          }
        })
        .catch((error) => {
          console.error("Error fetching events:", error);
        });
      setEvents(evs);
    };

    getEvents();
  }, [events]);

  console.log(events);

  return (
    <div className="event-list-container">
      <div className="events-header">Upcoming</div>
      <div className="event-list">
        {events.length > 0 ? (
          events.map((e, index) => <Event key={index} event={e} />)
        ) : (
          <span className="empty-list">
            nothing to see here,
            <br />
            add new reminders
          </span>
        )}
      </div>
    </div>
  );
}

export default Events;
