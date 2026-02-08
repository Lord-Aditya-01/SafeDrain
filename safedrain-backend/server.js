const http = require("http");
const app = require("./app");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});
require("./socket/socket")(io);
const connectDB = require("./config/db");

connectDB();


server.listen(5000, () => {
  console.log("Server running on port 5000");
});
