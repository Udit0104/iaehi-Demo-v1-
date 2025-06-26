// filepath: backend/routes/department.js
const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

// Get all departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a department (POST via Postman)
router.post("/", async (req, res) => {
  try {
    const { name, title, titleHindi, subdepartments } = req.body;

    if (!name || !title) {
      return res.status(400).json({ error: "name and title are required" });
    }

    const department = new Department({ name, title, titleHindi, subdepartments });
    const saved = await department.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Department name must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
