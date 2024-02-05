import React, { useEffect, useState } from "react";
import "./MoodSummary.css";
import Mood from "../Mood/Mood";
import json2csv from "json2csv";
import { BsDownload } from "react-icons/bs";

function MoodSummary({ notes }) {
  const [trackerData, setTrackerData] = useState({});
  const [doctorData, setDoctorData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the JSON file from the public folder
        const response = await fetch("http://127.0.0.1:5000/read_tracker");
        const data = await response.json();
        console.log("data: ", data);
        setTrackerData(data);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    // Fetch data initially when the component mounts
    fetchData();
  }, [notes]);

  const dates = [];
  const scores = [];
  for (const key in trackerData) {
    if (trackerData.hasOwnProperty(key)) {
      dates.push(key);
      scores.push(trackerData[key]);
    }
  }
  console.log("dates: ", dates);
  console.log("scores: ", scores);

  const handleDownload = () => {
    fetch("/doctorinfo.json")
      .then((response) => response.json())
      .then((data) => {
        // Convert the JSON data to an array of objects
        const jsonData = Object.entries(data).map(([date, score]) => ({
          date,
          score,
        }));
        const fields = ["date", "score"];
        const jsonParser = new json2csv.Parser({ fields });
        const csvData = jsonParser.parse(jsonData);
        // Create a Blob containing the CSV data
        const blob = new Blob([csvData], { type: "text/csv" });

        // Create a download link
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "my_mood_analysis.csv"; //filename

        // Trigger a click event on the link to start the download
        link.click();
      })
      .catch((error) => {
        console.error("Error fetching doctorinfo.json: ", error);
      });
  };

  return (
    <div className="moods-container">
      <div className="moods">
        {scores.map((score, index) => (
          <Mood key={index} date={dates[index]} mood={score} />
        ))}
      </div>
      <button className="download-button tooltip-csv" onClick={handleDownload}>
        <BsDownload className="download-icon" />
        <span class="tooltiptext-csv">Download data</span>
      </button>
    </div>
  );
}

export default MoodSummary;
