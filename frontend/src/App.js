import React from "react";
import "./App.css";
import "./globalStyles.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";
import JournalPage from "./pages/JournalPage/JournalPage";
import PlannerPage from "./pages/PlannerPage/PlannerPage";
import StorePage from "./pages/StorePage/StorePage";
import ChatPage from "./pages/ChatPage/ChatPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
