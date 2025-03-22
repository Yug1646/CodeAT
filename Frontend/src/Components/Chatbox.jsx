import React, { useState } from "react";
import "../CSS/chatbox.css"
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

  return (
    <>
      <div className="App">
        <div className="card">
          <h1 className="card-title">Notora</h1>
          <p>Enter a prompt and let AI do it's job.</p>
          <form className="App-form" onSubmit={submitHandler}>
            <label htmlFor="prompt">Enter your prompt : </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Prompt"
              className="App-input"
            />
            <button className="App-button" type="submit">
              Generate Content
            </button>
          </form>

          <section className="App-response">
            {mutation.isPending && <p>Generating your content...</p>}
            {mutation.isError && <p>{mutation.error.message}</p>}
            {mutation.isSuccess && (
              <div className="markdown-content">
                <Markdown>{mutation.data}</Markdown>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default Chatbox;
