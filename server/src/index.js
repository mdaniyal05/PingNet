const dotenv = require("dotenv");

dotenv.config();

const { httpServer, app } = require("./app");
const connectDB = require("./db/connectionDB");

require("./webSockets/socket");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("Error: ", error);
    });

    httpServer.listen(PORT, () => {
      console.log(`Server is running at: http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed: ", error);
  });
