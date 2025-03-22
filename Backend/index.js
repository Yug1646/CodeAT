require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
