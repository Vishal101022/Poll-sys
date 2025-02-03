import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getLocalStorage } from "../../helpers/localstorage.js";

const CreatorHeader = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userPic = getLocalStorage("imgURL");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userImg, setUserImg] = useState(
    "https://randomuser.me/api/portraits/lego/4.jpg"
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function loadUserPic() {
    const convertedValue = userPic === "null" ? null : userPic;
    if (convertedValue) {
      setUserImg(`http://localhost:5000/${userPic}`);
    }
  }

  useEffect(() => {
    loadUserPic();
  },[userPic]);

  return (
    <header className="sticky top-0 bg-gray-100 border-b border-slate-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center h-16 pt-4">
          <div className="flex self-end items-center space-x-3">
            <div className="relative inline-flex">
              <button
                className="inline-flex justify-center items-center group"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                onClick={toggleMenu}
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={userImg}
                  width="32"
                  height="32"
                  alt="UserImage"
                />
              </button>
              {isMenuOpen && (
                <div className="origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 right-0">
                  <div>
                    <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-slate-200 dark:border-slate-700">
                      <div className="font-medium text-slate-800 dark:text-slate-100">
                        {user.name || "Guest"}
                      </div>
                    </div>
                    <ul>
                      <li>
                        <Link
                          className="font-medium text-sm text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center py-1 px-3"
                          to="/creator/settings/account"
                        >
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CreatorHeader;
