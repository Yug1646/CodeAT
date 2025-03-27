const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  fileName: {
    type: String, // E.g., "HTML", "CSS"
    required: true,
  },
  topics: [
    {
      title: {
        type: String, // E.g., "Introduction to HTML"
        required: true,
      },
      description: {
        type: String, // Brief info about the topic
        required: true,
      },
      content: {
        type: String, // Actual content (Markdown/HTML)
        required: true,
      },
      tags: {
        type: [String], // Optional tags like ["basics", "HTML"]
      },
    },
  ],
});

module.exports = mongoose.model("Note", noteSchema);
