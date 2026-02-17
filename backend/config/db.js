const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongoDb is now connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
