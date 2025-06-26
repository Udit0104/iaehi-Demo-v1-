const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  email: { type: String, required: false },
  username: { type: String, required: true },
  isHappyWithResult: { type: Boolean, required: true },
  score: { type: Number, required: true },
  language: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
