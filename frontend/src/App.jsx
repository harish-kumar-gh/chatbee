import React from "react";
import { Route, Routes } from "react-router";

import HomePage from "./pages/HomePage.jsx";
import CallPage from "./pages/CallPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";

import toast, { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-screen" data-theme="night">

      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/call" element={<CallPage/>} />
        <Route path="/chat" element={<ChatPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignUpPage/>} />
        <Route path="/onboarding" element={<OnboardingPage/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
      </Routes>

      <Toaster/>
    </div>
  );
}

export default App;
