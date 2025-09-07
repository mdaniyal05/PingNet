const mongoose = require("mongoose");
const DB_NAME = require("../constants");

const connectDB = async () => {
  const URI = `${process.env.MONGODB_URI}/${DB_NAME}`;

  try {
    const connectionInstance = await mongoose.connect(URI);

    console.log(
      `\nMongoDB connected. DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;
