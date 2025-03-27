import React, { useState, useEffect } from "react";
import axios from "axios";

const History = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/history");
        setNotes(res.data);
      } catch (err) {
        console.error("Error fetching history:", err.message);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="history-container">
      <h1>Saved Notes History</h1>
      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        notes.map((note, index) => (
          <div key={index} className="note-card">
            <h2>File Name: {note.fileName}</h2>
            {note.topics.map((topic, idx) => (
              <div key={idx}>
                <h3>{topic.topic}</h3>
                <p>{topic.description}</p>
                <pre>{topic.codeExample}</pre>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default History;
