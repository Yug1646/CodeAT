import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../index.css";

const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect after logout
  };

  return (
    <>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">
            CodeAT
          </Link>
        </div>
        {/* Right side - Auth Buttons */}
        <div className="navbar-end">
          {localStorage.getItem("token") ? (
            <>
              {/* Left side - Logo/Brand */}

              {/* Center - Menu for larger screens */}
              <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                  <li>
                    <Link to="/chatbox">Chatbox</Link>
                  </li>
                </ul>
              </div>
              <button onClick={handleLogout} className="">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="">
                Login
              </Link>
              <Link to="/signup" className="">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
      <hr />
    </>
  );
};

export default Navbar;
