import { io } from "socket.io-client";

const socket = io("https://safedrain.onrender.com/", {
  transports: ["websocket"],
  autoConnect: true
});

export default socket;
