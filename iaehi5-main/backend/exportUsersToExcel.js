// filepath: exportUsersToExcel.js
const mongoose = require('mongoose');
const XLSX = require('xlsx');
const User = require('../backend/models/User'); // Adjust path if needed

// Connect to MongoDB
mongoose.connect('mongodb+srv://udithap145:B7gRCyOnpZXbw9z0@cluster0.j0loweg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  try {
    const users = await User.find().lean();
    // Convert to worksheet
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    XLSX.writeFile(workbook, 'users.xlsx');
    console.log('Exported users to users.xlsx');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
});