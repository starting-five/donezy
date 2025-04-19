const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB
const connectDB = async () => {
  try {
    // MongoDB URI from .env file (e.g., MongoDB Atlas or local MongoDB server)
    const mongoURI = process.env.MONGO_URI;

    // Connect to MongoDB using Mongoose
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,  // Use new URL parser to avoid warnings
      useUnifiedTopology: true,  // Use the new unified topology engine
      useCreateIndex: true,  // Create indexes automatically for new collections
      useFindAndModify: false  // Avoid deprecated `findAndModify` function
    });

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);  // Exit process if DB connection fails
  }
};

module.exports = connectDB;
