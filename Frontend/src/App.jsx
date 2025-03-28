import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Chatbox from "./Components/Chatbox";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import History from "./Components/History";
import Codegen from "./Components/Codegen";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbox" element={<Chatbox />} />
          <Route path="/history" element={<History />} />
          <Route path="/codeRe" element={<Codegen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
