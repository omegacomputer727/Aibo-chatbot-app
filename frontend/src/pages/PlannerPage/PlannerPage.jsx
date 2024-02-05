import React, { useState } from "react";
import "./PlannerPage.css";

import Navbar from "../../components/Navbar/Navbar";
import HomePage from "../HomePage/HomePage";
import Button from "../../components/Button/Button";
import Events from "../../components/Events/Events";
import Notification from "../../components/Notification/Notification";

import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from "@supabase/auth-helpers-react";

function PlannerPage() {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [dosage, setDosage] = useState("");
  const [phone, setPhone] = useState("");
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

  async function createRefillEvent() {
    // refill system -> reminder start date calculation
    const reminderDays = Number(duration) - 7; // 7 days before
    const date = new Date();
    const eventStart = date.getDate() + reminderDays;
    date.setDate(eventStart);
    console.log(eventStart);

    console.log("Creating refill event");
    const event = {
      summary: "Refill for " + eventName,
      description: eventDescription + "," + duration + "," + dosage,
      start: {
        dateTime: date.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: date.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    // TODO: set refill reminders everyday in the last week

    await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + session.provider_token,
        },
        body: JSON.stringify(event),
      }
    ).then((data) => {
      return data.json();
    });
  }

  async function createDailyReminderEvent() {
    const medicationStartDate = new Date(); // Start reminders from today
    const medicationEndDate = new Date();
    medicationEndDate.setDate(medicationStartDate.getDate() + Number(duration)); // Calculate end date

    // Create an array to hold all reminder events
    const reminderEvents = [];

    // Create a loop to generate daily reminder events
    while (medicationStartDate <= medicationEndDate) {
      const reminderDate = new Date(medicationStartDate);
      console.log(reminderDate);

      const event = {
        summary: "Take " + eventName, // Adjust the summary as needed
        description: eventDescription, // Adjust the description as needed
        start: {
          dateTime: reminderDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: reminderDate.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      reminderEvents.push(event);

      // Increment the date for the next reminder
      medicationStartDate.setDate(medicationStartDate.getDate() + 1);
    }

    // Use Promise.all to send all reminder events to Google Calendar API in parallel
    const results = await Promise.allSettled(
      reminderEvents.map((event) =>
        fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "POST",
            headers: {
              Authorization: "Bearer " + session.provider_token,
            },
            body: JSON.stringify(event),
          }
        ).then((data) => data.json())
      )
    );

    // Handle the results, whether fulfilled or rejected
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        console.log(
          `Reminder Event ${index + 1} set successfully:`,
          result.value
        );
      } else {
        console.error(
          `Error setting Reminder Event ${index + 1}:`,
          result.reason
        );
      }
    });

    // Clear form fields and show a notification
    setEventName("");
    setEventDescription("");
    setDuration("");
    setDosage("");
    setNotification("Created daily medication reminders.");
  }

  const isFormValid = () => {
    // Check if the required fields are not empty
    return (
      eventName.trim() !== "" &&
      eventDescription.trim() !== "" &&
      Number(duration.trim()) > 0 &&
      Number(dosage.trim()) > 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid()) {
      createRefillEvent();
      createDailyReminderEvent();
    } else {
      setNotification("Please insert valid input.");
    }
  };

  return (
    <div className="planner-page">
      {session ? (
        <>
          <Navbar />
          <Button label="Sign Out" callback={signOut} />

          <div className="content">
            <div className="left-column">
              <Events />
            </div>

            <div className="input right-column">
              <form type="submit">
                <div className="form-title">Medicine Reminder</div>
                <div className="details-picker">
                  <input
                    className="planner-input"
                    id="pillName"
                    type="text"
                    placeholder="Pill name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="details-picker">
                  <input
                    className="planner-input"
                    id="eventDesc"
                    type="text"
                    placeholder="Description"
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="details-picker">
                  <input
                    className="planner-input"
                    id="dosage"
                    type="text"
                    placeholder="Dosage per day"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="details-picker">
                  <input
                    className="planner-input"
                    id="duration"
                    type="text"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>

                {/* <hr /> */}

                <Button
                  label="Set Reminders"
                  type="submit"
                  callback={handleSubmit}
                />
              </form>

              {/* whatsapp notifs no more RIP */}
              {/* <div className="whatsapp-details-picker">
                <input
                  className="whatsapp-input"
                  id="phone"
                  type="text"
                  placeholder="Whatsapp Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                  required
                />
                <Button
                  className="whatspp-button"
                  label="Sign Up"
                  type="submit"
                  callback={handleWhatsappSubmit}
                />
              </div> */}
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

export default PlannerPage;
