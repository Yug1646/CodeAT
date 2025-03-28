require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const promData = require("./Models/PromData");
const Note = require("./Models/Notes");
const User = require("./Models/Users");

const app = express();
app.use(express.json());
app.use(bodyParser.json());

// -------------------- CORS CONFIG --------------------
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// -------------------- MONGO CONNECTION --------------------
mongoose
  .connect(process.env.User_MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// -------------------- SIGNUP CODE --------------------
app.post("/signup", async (req, res) => {
  try {
    const { fname, lname, uname, password } = req.body;

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create New User
    const newUser = new User({
      fname,
      lname,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: "✅ User added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN CODE --------------------
app.post("/login", async (req, res) => {
  try {
    const { uname, password } = req.body;

    // Find User
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(400).json({ error: "❌ User not found" });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "❌ Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "✅ Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- DETECT FILE NAME & TOPIC --------------------
const detectFileName = (prompt) => {
  if (prompt.toLowerCase().includes("html")) return "html_basics";
  if (prompt.toLowerCase().includes("css")) return "css_basics";
  if (prompt.toLowerCase().includes("javascript")) return "js_basics";
  return "general_notes";
};

const extractTopic = (prompt) => {
  const words = prompt.split(" ");
  return words.length > 5 ? words.slice(0, 5).join(" ") + "..." : prompt;
};

// -------------------- SAVE GENERATED DATA --------------------
app.post("/prom-data", async (req, res) => {
  try {
    const { prompt, generatedContent } = req.body;

    // Auto-detect file name and topic
    const fileName = detectFileName(prompt);
    const topic = extractTopic(prompt);

    // Create Note Object
    const noteData = new Note({
      fileName,
      topics: [
        {
          title: topic,
          description: prompt,
          content: generatedContent,
          tags: [fileName, "AI-generated"],
        },
      ],
    });

    // Save Note to Database
    await noteData.save();
    res.status(201).json({ message: "✅ Note saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GET ALL NOTES --------------------
app.get("/prom-data", async (req, res) => {
  try {
    const data = await Note.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- GEMINI API INTEGRATION --------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    res.send(text);
  } catch (error) {
    console.log(error);
    res.status(500).send("❌ Failed to generate content");
  }
});

// -------------------- SERVER LISTENING --------------------
app.listen(process.env.PORT || 5000, () => {
  console.log("🚀 Server running on port ${process.env.PORT || 5000}");
});