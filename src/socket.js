import { io } from "socket.io-client";

const socket = io("https://safedrain.onrender.com/", {
  autoConnect: true
});

export default socket;
