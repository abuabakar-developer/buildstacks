// deleteAllUsers.js
const mongoose = require('mongoose');
const User = require('./models/User').default;

// TODO: Replace with your actual MongoDB connection string
const MONGODB_URI = 'mongodb+srv://mu712576:ED5%2AdEzj.UmGG%2CV@bookstore-clustor.hktp40l.mongodb.net/?retryWrites=true&w=majority&appName=bookstore-clustor'
;

async function deleteUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    const result = await User.deleteMany({});
    console.log('Deleted users:', result);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error deleting users:', err);
    process.exit(1);
  }
}

deleteUsers(); 