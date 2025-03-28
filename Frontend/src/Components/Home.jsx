import React from "react";
import "../CSS/home.CSS";
import heroImage from "../assets/img-ex.png";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  return (
    <>
    
    <section className="home-container">
      <h1 className="main-heading">AI Learning Assistant</h1>
      <p className="sub-text">
      A Smart Chatbot that generates code and study content in a well-structured, clear format.
      </p>

      <div className="content-wrapper">
        <div className="text-section">
          <h2 className="subheading">CodeAT</h2>
          <p className="paragraph">
          Codeat – Your AI-Powered Learning Assistant!  
          Generate clean, well-structured code and study content with ease. Optimize your code in one click for better efficiency and readability. Get instant explanations and learn smarter with AI-driven insights!
          </p>
          <Link to="/signup" className="button">
            Let's get started
          </Link>
        </div>
        <div className="img-explain">
          <img src={heroImage} alt="Code Optimization" />
        </div>
      </div>
    </section>


      <section className="about">
        <div id="card-info">
          <h2>How it works</h2>
        </div>

        <div className="cards-container">
          <div className="intro-card intro-card1">
            <h2>Smart Code Drop, Get clean structured code in seconds.</h2>
          </div>
          <div className="intro-card">
            <h2>One-Click Boost, Optimize your code for max efficiency. </h2>
          </div>
          <div className="intro-card intro-card3">
            <h2>Chat & Learn,  Ask, code, improve—AI's got your back!</h2>
          </div>
        </div>
      </section>

    </>
  );
};

export default Home;
