const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fakejobshield', {
      serverSelectionTimeoutMS: 3000 // fail fast if offline
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('WARNING: Express backend is proceeding without MongoDB. Database writes/reads will be simulated or fail, but the REST API server remains online.');
  }
};

module.exports = connectDB;
