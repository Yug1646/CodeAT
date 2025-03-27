import React, { useState } from "react";
import "../CSS/login.css";

const Login = () => {
  const [user, setUser] = useState({
    uname: "",
    password: "",
  });
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // alert("Login successful!");
        // Store token in localStorage (if using JWT authentication)
        localStorage.setItem("token", data.token);
        // Redirect user (if needed)
        window.location.href = "/";
      } else {
        alert(`Login failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error Login: ", error);
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Login to Account</h2>
          <form onSubmit={handleSubmit}>
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

            {/* <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div> */}

            <button className="login-button">Login</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
