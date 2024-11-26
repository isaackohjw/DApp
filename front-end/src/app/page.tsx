import React from "react";
import { Taskbar } from "../components/taskbar";

export default function Home() {
  return (
    <div className="min-h-screen text-white font-title">
      <Taskbar />
      <div className="p-4">
        <h1>Welcome to the Home Page!</h1>
        <p>This is your main content area.</p>
      </div>
    </div>
  );
}
