const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var disconnectName;
var online = 0;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/name.html');
});

app.get('/chat', (req, res) => {
  disconnectName = req.query.name;
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
    online = 1;
  });

  // chat message functionality
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
    console.log('message: ', data);
  });

  // user is typing functionality
  socket.on('is typing', (data) => {
    io.emit('is typing', data.name + ' is typing...');
  });

  // some user disconnected functionality
  socket.on('disconnect', function () {
    if( online = 0 ){
      io.emit('chat message1', {username: disconnectName, usermessage: 'disconnected'});
    }
  });
});
