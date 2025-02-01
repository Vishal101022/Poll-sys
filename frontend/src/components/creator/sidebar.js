import React, { useState } from "react";
import { logout } from "../../services/creator_auth.service";
import { successToast } from "../../utils/toaster";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [toggleSb, setToggleSb] = useState(false);

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar-multi-level-sidebar");
    sidebar.classList.toggle("-translate-x-full");
    setToggleSb(!toggleSb);
  };

  const toggleDropdown = (event) => {
    const dropdown = event.currentTarget.nextElementSibling;
    dropdown.classList.toggle("hidden");
  };

  const handleLogout = () => {
    logout();
    successToast("Logged out successfully");
    navigate("/");
  };

  const handleSubMenu = (event) => {
    const dropdown = event.currentTarget.nextElementSibling;
    dropdown.classList.toggle("hidden");
  };

  return (
    <div className="fixed flex flex-col left-0 w-14 hover:w-64 md:w-64 bg-gray-100 h-full text-black transition-all duration-300 border-none z-40 sidebar">
      <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
        <ul className="flex flex-col py-4 space-y-1">
          <li className="px-5 hidden md:block border-b pb-5 mb-5">
            <Link
              to="/"
              className="text-lg font-semibold tracking-widest text-black uppercase rounded-lg focus:outline-none focus:shadow-outline"
            >
              Poll-sys
            </Link>
          </li>
          <li className="px-5 md:hidden">
            <Link to="/" className="flex flex-row items-center h-8">
              <img src="/logo.png" alt="" className="w-5 h-5 mx-auto" />
            </Link>
          </li>
          <li className="px-5 hidden md:block">
            <div className="flex flex-row items-center h-8">
              <div className="text-sm font-light tracking-wide text-gray-400 uppercase">
                Menu
              </div>
            </div>
          </li>
          <li>
            <Link
              to="/creator/dashboard"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <a
              onClick={(e) => handleSubMenu(e)}
              href="void:javascript()"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3" y2="6" />
                  <line x1="3" y1="12" x2="3" y2="12" />
                  <line x1="3" y1="18" x2="3" y2="18" />
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">Polls</span>
              <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide">
                <svg
                  className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 false"
                  viewBox="0 0 12 12"
                >
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                </svg>
              </span>
            </a>

            {/* create submenu and consider the overall style */}
            <ul className="hidden flex flex-col py-2 space-y-1">
              <li className="">
                <Link
                  to={"/creator/polls"}
                  className="relative flex flex-row items-center px-12 h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
                >
                  {" "}
                  List/All Polls
                </Link>
              </li>
              <li className="">
                <Link
                  to={"/creator/polls/create"}
                  className="relative flex flex-row items-center px-12 h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
                >
                  {" "}
                  Add Poll
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link
              to={"/creator/activity"}
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-4 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />{" "}
                  <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />{" "}
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />{" "}
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Activity
              </span>
            </Link>
          </li>
          <li>
            <a
              onClick={(e) => handleSubMenu(e)}
              href="void:javascript()"
              className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Settings
              </span>
              <span className="hidden md:block px-2 py-0.5 ml-auto text-xs font-medium tracking-wide">
                <svg
                  className="w-3 h-3 shrink-0 ml-1 fill-current text-slate-400 false"
                  viewBox="0 0 12 12"
                >
                  <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                </svg>
              </span>
            </a>

            {/* create submenu and consider the overall style */}
            <ul className="hidden flex flex-col py-2 space-y-1">
              <li className="">
                <Link
                  to={"/creator/settings/account"}
                  className="relative flex flex-row items-center px-12 h-9 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
                >
                  {" "}
                  My Account
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="relative w-full flex flex-row items-center h-11 focus:outline-none hover:bg-indigo-300 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6"
            >
              <span className="inline-flex justify-center items-center ml-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-arrow-right"
                  viewBox="0 0 16 16"
                >
                  {" "}
                  <path
                    fillRule="evenodd"
                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                  />{" "}
                </svg>
              </span>
              <span className="ml-2 text-sm tracking-wide truncate">
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
