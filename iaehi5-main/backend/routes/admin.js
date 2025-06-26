// filepath: /c:/Users/uditv/OneDrive/Desktop/iaehi/backend/routes/admin.js
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

// Authenticate admin
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Return role and department in response
    res.json({
      message: "Login successful",
      role: admin.role,
      department: admin.department,
      username: admin.username
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
