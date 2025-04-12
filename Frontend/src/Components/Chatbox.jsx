import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Showdown from "showdown";
import ReactShowdown from "react-showdown";
import "../CSS/chatbox.css";

// API call to Gemini (or your backend API)
const makeAPIRequest = async (prompt) => {
  const res = await axios.post("http://localhost:5000/generate", { prompt });
  return res.data; // Expecting response in Markdown format
};

const Chatbox = () => {
  const location = useLocation();
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState("");

  // Use mutation for API calls
  const mutation = useMutation({
    mutationFn: makeAPIRequest,
    mutationKey: ["gemini-api-request"],
    onSuccess: (data) => {
      const updatedChatHistory = [
        ...chatHistory,
        { role: "user", content: prompt },
        { role: "bot", content: data },
      ];
      setChatHistory(updatedChatHistory);
      saveToDatabase(prompt, updatedChatHistory);
      setPrompt(""); // Clear input after sending
    },
    onError: (error) => {
      setMessage("❌ Error generating content.");
      console.error("Error:", error);
    },
  });

  // Load chat history from selected saved note
  useEffect(() => {
    if (location.state?.note) {
      const note = location.state.note;
      if (note.topics[0]?.content) {
        try {
          const parsedContent = JSON.parse(note.topics[0].content);
          setChatHistory(
            Array.isArray(parsedContent)
              ? parsedContent
              : [
                  {
                    role: "system",
                    content: `📌 Continuing chat on: ${note.topics[0]?.title}`,
                  },
                  {
                    role: "bot",
                    content: note.topics[0]?.description || parsedContent,
                  },
                ]
          );
        } catch (e) {
          setChatHistory([
            {
              role: "system",
              content: `📌 Continuing chat on: ${note.topics[0]?.title}`,
            },
            {
              role: "bot",
              content: note.topics[0]?.description || note.topics[0]?.content,
            },
          ]);
        }
      }
    }
  }, [location.state]);

  // Save chat history to database
  const saveToDatabase = async (prompt, history) => {
    try {
      const saveResponse = await fetch("http://localhost:5000/prom-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          generatedContent: JSON.stringify(history),
        }),
      });

      if (saveResponse.ok) {
        setMessage("✅ Content saved successfully!");
      } else {
        setMessage("❌ Failed to save content.");
      }
    } catch (error) {
      console.error("Error saving to database:", error);
      setMessage("❌ Error saving content.");
    }
  };

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
    if (chatHistory.length > 0) {
      // Combine all chat messages into one markdown document
      const markdownContent = chatHistory
        .map((chat) => {
          return chat.role === "user"
            ? `**You:** ${chat.content}`
            : `**AI:** ${chat.content}`;
        })
        .join("\n\n---\n\n");

      const htmlContent = convertMarkdownToHTML(markdownContent);

      // Create a new window and write the HTML content
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(`
          <html>
            <head>
              <title>Generated Chat History</title>
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
                hr {
                  border: 0;
                  height: 1px;
                  background: #ddd;
                  margin: 20px 0;
                }
                .user-message {
                  color: #0066cc;
                }
                .bot-message {
                  color: #333;
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
    if (!prompt.trim()) {
      setMessage("⚠ Please enter a valid prompt.");
      return;
    }
    setMessage("");
    mutation.mutate(prompt);
  };

  return (
    <div className="App">
      <div className="card">
        <h1 className="card-title">CodeAT</h1>

        {/* Display Chat History */}
        <section className="chat-history">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-bubble ${chat.role}`}>
              <strong>{chat.role === "user" ? "You: " : "AI: "}</strong>
              <div className="markdown-content">
                <ReactShowdown
                  markdown={chat.content}
                  options={{ tables: true, emoji: true }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Display Loading/Error States */}
        <section className="App-response">
          {mutation?.isPending && <p>Generating your content...</p>}
          {message && <p className="message">{message}</p>}
        </section>

        {/* User Input Form */}
        <form className="App-form" onSubmit={submitHandler}>
          <textarea
            rows="4"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your query here..."
            className="App-input"
          />
          <div className="button-container">
            <button
              type="button"
              className="App-button"
              onClick={handleSave}
              disabled={chatHistory.length === 0}
            >
              Open in New Page
            </button>
            <button
              type="submit"
              className="App-button"
              disabled={mutation?.isPending}
            >
              {mutation?.isPending ? "⏳ Generating..." : "🚀 Generate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbox;
