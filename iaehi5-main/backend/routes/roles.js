const express = require("express");
const router = express.Router();
const Role = require("../models/Role");

// GET /api/roles - fetch all roles
router.get("/", async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

module.exports = router;