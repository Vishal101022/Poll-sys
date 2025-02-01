import React, { useEffect, useState } from "react";
import links from "../utils/nav_link";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../helpers/localstorage";

const Header = ({ isAuth, auth }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(isAuthenticated());
  }, []);

  console.log(user);

  const [mobileMenuHidden, setMobileMenuHidden] = useState(false);

  const url = window.location.pathname;

  return (
    <div className="bg-gray-50 sticky top-0 z-40  border-b border-slate-600">
      <nav className="relative px-4 py-4 flex justify-around items-center max-w-7xl ">
        <Link
          className="text-3xl text-black font-bold leading-none"
          to="/"
        >
          Poll-sys
        </Link>
        <div
          className="lg:hidden"
          onClick={() => setMobileMenuHidden(!mobileMenuHidden)}
        >
          <button className="navbar-burger flex items-center  text-black p-3">
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
        {!user && (
          <div className="ml-4">
            <Link
              className=" hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-blue-200 hover:bg-gray-300 text-sm text-gray-900 font-bold  transition duration-200"
              to={links.login}
            >
              Sign In
            </Link>
            <Link
              className="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-400 text-sm text-white font-bold transition duration-200"
              to={links.register}
            >
              Sign up
            </Link>
          </div>
        )}

        {user && user.role && (
          <>
            <Link
              className="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-blue-500 hover:bg-blue-400 text-sm text-white font-semibold rounded-sm"
              to={`/${user.role}/dashboard`}
            >
              Dashboard
            </Link>
          </>
        )}
      </nav>
      
    </div>
  );
};

export default Header;
