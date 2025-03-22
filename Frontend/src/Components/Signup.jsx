import React, { useState } from "react";
import "../CSS/login.css";

const Signup = () => {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    uname: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        alert("Signup successful!");
        window.location.href = "/"; 
      } else {
        alert(`Signup failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  return (
    <>
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">First Name</label>
              <input
                name="fname"
                type="text"
                className="input-field"
                placeholder="Enter your first name"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Last Name</label>
              <input
                name="lname"
                type="text"
                className="input-field"
                placeholder="Enter your last name"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                name="uname"
                type="text"
                className="input-field"
                placeholder="Enter username"
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                name="password"
                type="password"
                className="input-field"
                placeholder="Create password"
                onChange={handleChange}
              />
            </div>
            {/* <div className="input-group">
            <label className="input-label">Confirm Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter password"
            />
          </div> */}
            <button className="signup-button">Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
