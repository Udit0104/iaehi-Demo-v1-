// filepath: /c:/Users/uditv/OneDrive/Desktop/iaehi/backend/addAdmin.js
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI); // Change to your DB

async function createAdmins() {
  await Admin.deleteMany({}); // Optional: clear existing admins

  await Admin.create([
    {
      username: "superadmin",
      password: "superpassword", // will be hashed automatically
      role: "superadmin",
      department: null,
    },
    {
      username: "itcaadmin",
      password: "itcapd",
      role: "departmentadmin",
      department: "Information Technology and Computer Application",
    },
    {
      username: "csedadmin",
      password: "csedpd",
      role: "departmentadmin",
      department: "CSED",
    },
    {
      username: "hindimaintenanceadmin",
      password: "hindimaintpassword",
      role: "departmentadmin",
      department: "रखरखाव",
    },
    // Add more admins as needed
  ]);

  console.log("Admins created!");
  mongoose.disconnect();
}

createAdmins();