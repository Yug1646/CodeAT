const mongoose = require("mongoose");

const promSchema = new mongoose.Schema({
  title: String,
  description: String,
  topicCovered: [String], // ✅ Make it an array
  codeExample: String,
  filePath: String, // For the generated HTML file
});

const promData = mongoose.model("promData", promSchema);
module.exports = promData;
