// ... existing code ...

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");

// ... existing code ...

// Setup middleware
app.use(cors());
app.use(express.json());

// Setup routes
app.use("/users", userRoutes);

// Additional endpoint for feedback
app.use("/feedback", (req, res, next) => {
  // Redirects to the users/feedback route
  req.url = "/feedback" + req.url;
  req.originalUrl = "/feedback" + req.originalUrl;
  userRoutes(req, res, next);
});

// ... existing code ...

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/myapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// ... existing code ...
