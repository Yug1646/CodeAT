import React, { useState } from "react";
import "../CSS/login.css";

const Login = () => {
  const [user, setUser] = useState({
    uname: "",
    password: "",
  });

  const [error, setError] = useState(""); // for error message

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError(""); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login: ", error);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login to Account</h2>

          <form onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>} {/* Show error message */}

            <div className="input-group">
              <label className="input-label">Username</label>
              <input
                name="uname"
                type="text"
                placeholder="Enter your Username"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                className="input-field"
                onChange={handleChange}
              />
            </div>

            <div className="links">
              <a href="/signup">Create Account</a>
            </div>

            <button className="login-button">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
