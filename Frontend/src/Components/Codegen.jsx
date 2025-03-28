import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { tomorrowNight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import userIcon from "../assets/user.png";

const Codegen = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! Welcome to CodeAt. Enter your code here, and I'll optimize it for you.",
      sender: "bot",
      isCode: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    const userCode = data.userInput.trim();
    if (!userCode) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userCode, sender: "user", isCode: true },
    ]);

    const userCredentials = {
      code: userCode,
      mode: data.mode,
      language: data.language,
    };

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/refactor", userCredentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data?.refactoredCode) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: res.data.refactoredCode, sender: "bot", isCode: true },
          {
            text: `💡 Explanation: ${res.data.explanation || "No explanation provided."} ***-*** Accuracy Score: ${res.data.qualityScore}%`,
            sender: "bot",
            isCode: false,
          },
        ]);
      }

      reset();
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Oops! Something went wrong.", sender: "bot", isCode: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {messages.map((msg, index) => (
        <div key={index} className={`chat ${msg.sender === "user" ? "chat-end" : "chat-start"}`}>
          <img alt="Avatar" src={userIcon} />
          <div className="chat-bubble">
            {msg.isCode ? (
              <SyntaxHighlighter language="javascript" style={darcula}>
                {msg.text.trim()}
              </SyntaxHighlighter>
            ) : (
              <div>
                <ReactMarkdown>{msg.text.split("***-***")[0]}</ReactMarkdown>
                <br />
                <h1 className="font-extrabold">{msg.text.split("***-***")[1]}</h1>
              </div>
            )}
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit(onSubmit)}>
        <textarea placeholder="Enter your code..." {...register("userInput")} />
        <select name="mode" {...register("mode")}>
          <option value="Readability">Readability</option>
          <option value="Performance">Performance</option>
          <option value="Code Llama">Code Llama</option>
          <option value="Mistral">Mistral</option>
        </select>
        <select name="language" {...register("language")}>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Code Llama">Code Llama</option>
          <option value="Mistral">Mistral</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default Codegen;
