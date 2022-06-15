const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/name.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// establishing connection between FE & BE
io.on('connection', (socket) => {

  // a user connected functionality
  socket.on('conn', (msg1) => {
    io.emit('conn', msg1);
  });

  // chat message functionality
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
    console.log('mesage: ', data);
  });

  // some user disconnected functionality
  socket.on('disconnect', function () {
    io.emit('chat message', 'some user disconnected');
  });
});
