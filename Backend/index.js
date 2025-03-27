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
const promData = require("./Models/PromData"); // Import updated schema
const Note = require("./Models/Notes");


const app = express();
app.use(express.json());
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.User_MONGO_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Conneection Error : ", err));

// -------------------- SIGNUP CODE --------------------
const User = require("./Models/Users");
app.post("/signup", async (req, res) => {
  try {
    // const newUser = new User({
    //   fname: req.body.fname,
    //   lname: req.body.lname,
    //   uname: req.body.uname,
    //   password: req.body.password,
    // });
    const { fname, lname, uname, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      fname,
      lname,
      uname,
      password: hashedPassword,
    });

    await newUser.save();
    res.json({ message: "User added Successfully !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------- LOGIN CODE --------------------
app.post("/login", async (req, res) => {
  try {
    const { uname, password } = req.body;

    // Find USER
    const user = await User.findOne({ uname });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invaild Credentials" });
    }
    // Generate TOKEN
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });
    res.json({ message: "Login Succesful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- SAVING DATA --------------------
app.post("/prom-data", async (req, res) => {
  try {
    const { title, description, topicCovered, codeExample, category, tags } = req.body;

    // Create HTML Content
    const content = `
      <html>
        <head><title>${title}</title></head>
        <body>
          <h1>${title}</h1>
          <p>${description}</p>
          <h2>Topics Covered</h2>
          <ul>
            ${topicCovered.map((topic) => `<li>${topic}</li>`).join("")}
          </ul>
          <h2>Code Example</h2>
          <pre><code>${codeExample}</code></pre>
        </body>
      </html>
    `;

    // File Path to Save (Create 'notes' directory if not exists)
    const notesDir = path.join(__dirname, "notes");
    if (!fs.existsSync(notesDir)) {
      fs.mkdirSync(notesDir);
    }

    // Define File Name and Path
    const fileName = `${title.replace(/\s/g, "_").toLowerCase()}.html`;
    const filePath = path.join(notesDir, fileName);

    // Save HTML File
    fs.writeFileSync(filePath, content);

    // Save Only File Path in DB
    const newData = new promData({
      title,
      description,
      topicCovered,
      codeExample,
      category,
      tags,
      filePath, // Store file path instead of content
    });

    // Save to DB
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- GET FILE CONTENT ----------------
app.get("/prom-data", async (req, res) => {
  try {
    const data = await promData.find(); // Fetch all stored notes
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add or update notes by fileName
app.post("/prom-data", async (req, res) => {
  const { prompt, generatedContent } = req.body;

  // Auto-detect topic and fileName
  const fileName = detectFileName(prompt); // Function to categorize
  const topic = extractTopic(prompt); // Function to extract the topic

  const noteData = {
    fileName,
    topics: [
      {
        topic,
        description: prompt,
        codeExample: generatedContent,
      },
    ],
  };

  try {
    const result = await db.collection("notes").insertOne(noteData);
    res.status(200).send("Note saved successfully!");
  } catch (err) {
    res.status(500).send("Error saving note: " + err.message);
  }
});

// -------------------- GEMINI KEY --------------------
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
    res.status(500).send("Failed to generate content");
  }
});

app.listen(process.env.PORT, console.log("Server is running"));
