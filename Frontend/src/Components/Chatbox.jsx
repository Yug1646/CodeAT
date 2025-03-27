import React, { useState } from "react";
import "../CSS/chatbox.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Showdown from "showdown"; // Import Showdown for conversion
import ReactShowdown from "react-showdown"; // Showdown for displaying content

// API call to Gemini (or your backend API)
const makeAPIRequest = async (prompt) => {
  const res = await axios.post("http://localhost:5000/generate", { prompt });
  return res.data; // Expecting response in Markdown format
};

const Chatbox = () => {
  const [prompt, setPrompt] = useState("");
  const mutation = useMutation({
    mutationFn: makeAPIRequest,
    mutationKey: ["gemini-api-request"],
  });

  // Convert Markdown to HTML using Showdown
  const convertMarkdownToHTML = (markdown) => {
    const converter = new Showdown.Converter({
      tables: true,
      emoji: true,
    });
    return converter.makeHtml(markdown);
  };

  // Open the output in a new page
  const handleSave = () => {
    if (mutation?.data) {
      const htmlContent = convertMarkdownToHTML(mutation.data);

      // Create a new window and write the HTML content
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(`
          <html>
            <head>
              <title>Generated Notes</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  padding: 20px;
                  background-color: #f9f9f9;
                }
                h1, h2, h3 {
                  color: #333;
                }
                pre {
                  background-color: #333;
                  color: #fff;
                  padding: 12px;
                  border-radius: 8px;
                  overflow-x: auto;
                }
                code {
                  background-color: #eee;
                  padding: 4px;
                  border-radius: 4px;
                }
                ul {
                  margin-top: 10px;
                  margin-bottom: 10px;
                }
              </style>
            </head>
            <body>
              ${htmlContent}
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        alert("Popup blocked! Please allow popups to open the content.");
      }
    } else {
      alert("No content to display! Please generate content first.");
    }
  };

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate(prompt);
  };

  return (
    <div className="App">
      <div className="card">
        <h1 className="card-title">CodeAT</h1>

        {/* Display API Response */}
        <section className="App-response">
          {mutation?.isPending && <p>Generating your content...</p>}
          {mutation?.isError && <p>{mutation.error.message}</p>}

          {/* Showdown renders the Markdown content */}
          {mutation?.isSuccess && (
            <div className="markdown-content">
              <ReactShowdown
                markdown={mutation.data}
                options={{ tables: true, emoji: true }}
              />
            </div>
          )}
        </section>

        {/* User Input Form */}
        <form className="App-form" onSubmit={submitHandler}>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="App-input"
          />
          <div className="button-container">
            <button type="button" className="App-button" onClick={handleSave}>
              Open in New Page
            </button>
            <button type="submit" className="App-button">
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
