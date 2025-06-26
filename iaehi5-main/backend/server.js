// filepath: /c:/Users/uditv/OneDrive/Desktop/iaehi/backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory store for OTPs (for demo; use DB/Redis for production)
const otpStore = {};

// OTP Send Endpoint
app.post("/api/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { otp, expires: Date.now() + 10 * 60 * 1000 }; // 10 min expiry

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

// OTP Verify Endpoint
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (record && record.otp === otp && Date.now() < record.expires) {
    delete otpStore[email];
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: "Invalid or expired OTP" });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello from the backend server!");
});

// Connect to MongoDB and load routes
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, // Optional: increase timeout
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Import routes only after DB connects
    const usersRouter = require("./routes/users");
    app.use("/users", usersRouter);

    const adminRouter = require("./routes/admin");
    app.use("/admin", adminRouter);

    const departmentRoutes = require("./routes/department");
    app.use("/api/departments", departmentRoutes);

    const rolesRouter = require("./routes/roles");
    app.use("/api/roles", rolesRouter);

    // Start the server after successful DB connection
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
