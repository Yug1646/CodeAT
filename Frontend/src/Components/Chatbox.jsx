import React, { useState } from "react";
import "../CSS/chatbox.css";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import Markdown from "react-markdown";

const makeAPIRequest = async (prompt) => {
  const res = await axios.post("http://localhost:5000/generate", { prompt });
  // console.log(res.data);
  return res.data;
};

const Chatbox = () => {
  const [prompt, setPrompt] = useState("");
  const mutation = useMutation({
    mutationFn: makeAPIRequest,
    mutationKey: ["gemini-api-request"],
  });

  const submitHandler = (e) => {
    e.preventDefault();
    mutation.mutate(prompt);
  };
  const handleSave = () => {
    console.log("Save button clicked!");
    // Add your saving logic here
  };
  return (
    <>
      <div className="App">
        <div className="card">
          <h1 className="card-title">CodeAT</h1>
          <section className="App-response">
            {mutation?.isPending && <p>Generating your content...</p>}
            {mutation?.isError && <p>{mutation.error.message}</p>}
            {mutation?.isSuccess && (
              <div className="markdown-content">
                <Markdown>{mutation.data}</Markdown>
              </div>
            )}
          </section>

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
                Save
              </button>
              <button type="submit" className="App-button">
                Generate
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
