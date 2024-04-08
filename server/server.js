const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware

const PORT = 4000;
const app = express();
const server = http.createServer(app);
// const io = socketIo(server);

// Use CORS middleware
app.use(cors({
    origin: '*'
}));

const io = require("socket.io")(server, {
    cors: {
      origin: process.env.APP_URL ?  process.env.APP_URL: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', (message) => {
    console.log('Message:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
