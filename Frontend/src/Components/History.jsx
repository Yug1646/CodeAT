import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CSS/history.css"

const History = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch chat history
  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/prom-data");
      const data = await response.json();

      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("Unexpected response format:", data);
        setNotes([]);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (location.state?.note) {
      const note = location.state.note;
      setChatHistory(
        note.topics[0]?.content ? JSON.parse(note.topics[0]?.content) : []
      );
    }
  }, [location.state]);

  // Resume chat
  const handleResumeChat = (note) => {
    navigate("/chatbox", { state: { note } }); // Pass full note object
  };

  return (
    <>
      <div className="history-container">
        <h2>📚 Saved Conversations</h2>
        {loading ? (
          <p>⏳ Loading history...</p>
        ) : (
          <div className="notes-list">
            {notes.length === 0 ? (
              <p>❌ No chat history found.</p>
            ) : (
              notes.map((note, index) => (
                <div key={note._id || index} className="note-card">
                  <h3>🗂 Conversation {index + 1}</h3>
                  <p>
                    {note.chatHistory?.[0]?.message?.slice(0, 50) ||
                      "No messages available"}
                    ...
                  </p>
                  <button className="his-but" onClick={() => handleResumeChat(note)}>
                    🔄 Resume Chat
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default History;
