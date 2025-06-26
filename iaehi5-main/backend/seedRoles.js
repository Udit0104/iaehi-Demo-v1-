const mongoose = require("mongoose");
const Role = require("./models/Role");
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);
const roles = [
  { name: "Professor", nameHindi: "प्राध्यापक" },
  { name: "Associate Professor", nameHindi: "सह-प्राध्यापक" },
  { name: "Assistant Professor", nameHindi: "सहेयक-प्राध्यापक" },
  { name: "Professor of Practice", nameHindi: "अभ्यास के प्राध्यापक"},
  { name: "Adjunct Professor", nameHindi: "सहायक प्रोफेसर"},
  { name: "Faculty on Contract", nameHindi: "अनुबंध पर शैक्षणिक स्टाफ"},
];

Role.insertMany(roles)
  .then(() => {
    console.log("Roles seeded");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });