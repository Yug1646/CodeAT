import React from "react";
import "../CSS/home.CSS";

const Home = () => {
  return (
    <section className="home-container">
      <h1 className="main-heading">AI Learning Assistant</h1>
      <p className="sub-text">
        Enhance your code efficiency with AI-refactor smarter, optimize
        instantly, and code with precision.
      </p>

      <div className="content-wrapper">
        <div className="text-section">
          <h2 className="subheading">CodeAT</h2>
          <p className="paragraph">
            Refactor, clean, and improve your code instantly with our
            AI-powered tool. Supporting multiple programming languages,
            customization optimization modes, and real-time quality scoring, we
            help developers write cleaner, more efficient code with ease. Start
            coding smarter today!
          </p>
          <a href="#" className="button">Let's get started</a>
        </div>

        <div className="image-section">
          <img src="/your-image-path.png" alt="Code snippet" className="image" />
        </div>
      </div>
    </section>
  );
};

export default Home;
