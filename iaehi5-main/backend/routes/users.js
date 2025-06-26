// filepath: backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Feedback = require("../models/Feedback");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(Array.isArray(users) ? users : []); // Ensure the response is an array
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    department: req.body.department,
    subdepartment: req.body.subdepartment || "",
    ageGroup: req.body.ageGroup,
    gender: req.body.gender,
    score: req.body.score,
    result: req.body.result,
    language: req.body.language || "en", // Default language is English
    isHappyWithResult: req.body.isHappyWithResult, // feedback
    timestamp: req.body.timestamp,                 // feedback
    role: req.body.role
  });

  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all feedback
router.get("/feedback", async (req, res) => {
  try {
    const feedback = await Feedback.find();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new feedback
router.post("/feedback", async (req, res) => {
  const feedback = new Feedback({
    email: req.body.email || "",
    username: req.body.username,
    isHappyWithResult: req.body.isHappyWithResult,
    score: req.body.score,
    language: req.body.language || "en",
    timestamp: req.body.timestamp || new Date(),
  });

  try {
    const newFeedback = await feedback.save();
    res.status(201).json(newFeedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
