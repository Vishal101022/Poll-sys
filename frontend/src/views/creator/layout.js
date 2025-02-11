import React from "react";
import "../../styles/creator-layout.css";
import CreatorSidebar from "../../components/creator/sidebar";
import CreatorHeader from "../../components/creator/header";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import CreatePoll from "./poll/create.js";
import PollsList from "./poll/list.js";
import PollResult from "./poll/result.js";
import EditPoll from "./poll/edit.js";
import CommentByPoll from "./comments/list-by-poll.js";
import CreateTheme from "./themes/create";
import Activity from "./activity";
import Account from "./settings/account";


const CreatorLayout = () => {
  return (
    // <!-- component -->
    <div x-data="setup()">
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white text-black dark:text-white">
        {/* <!-- Sidebar --> */}
        <CreatorSidebar />
        {/* <!-- ./Sidebar --> */}

        <div className="h-full ml-14 md:ml-64">
          <CreatorHeader />
          <div className="px-4 py-8 md:px-8">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/polls/create" element={<CreatePoll />} />
              <Route path="/edit-poll/:pollId" element={<EditPoll />} />
              <Route path="/polls" element={<PollsList />} />
              <Route path="/poll-result/:pollId" element={<PollResult />} />
              <Route
                path="/poll-comments/:pollId"
                element={<CommentByPoll />}
              />
              
              
             
              <Route path="/themes/create" element={<CreateTheme />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/settings/account" element={<Account />} />
              <Route
                path="*"
                element={<Navigate to={"/creator/dashboard"} />}
              />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorLayout;
