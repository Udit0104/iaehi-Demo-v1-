// filepath: /c:/Users/uditv/OneDrive/Desktop/iaehi/backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello from the backend server!");
});

// Import and use the users route
const usersRouter = require("./routes/users");
app.use("/users", usersRouter);

// Import and use the admin route
const adminRouter = require("./routes/admin");
app.use("/admin", adminRouter);

// Import and use the department route
const departmentRoutes = require("./routes/department");
app.use("/api/departments", departmentRoutes);

// Import and use the roles route
const rolesRouter = require("./routes/roles");
app.use("/api/roles", rolesRouter);

// In-memory store for OTPs (for demo; use DB/Redis for production)
const otpStore = {};

// Endpoint to send OTP
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

  // Send OTP email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });
    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Endpoint to verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];
  if (record && record.otp === otp && Date.now() < record.expires) {
    delete otpStore[email]; // OTP used, remove it
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid or expired OTP" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
