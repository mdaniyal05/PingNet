const dotenv = require("dotenv");

dotenv.config();

const app = require("./app");
const connectDB = require("./db/connectionDB");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error: ", error);
    });

    app.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed: ", error);
  });
