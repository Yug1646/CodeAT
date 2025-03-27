import React from "react";
import { Link } from "react-router-dom";
import "../index.css"
const Navbar = () => {
  return (
    <>
      <div class="navbar bg-base-100 shadow-sm">
        <div class="navbar-start">
          <Link to="/" class="butto btn-ghost text-xl">CodeAT</Link>
        </div>
        <div class="navbar-center hidden lg:flex">
          <ul class="menu menu-horizontal px-1">
            <li>
              <Link to="/chatbox">Chatbox</Link>
            </li>
          </ul>
        </div>
        <div class="navbar-end">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      </div>
      <hr />
    </>
  );
};

export default Navbar;
