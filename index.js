const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var disconnectName;
var online = false;
var status = 'whatever';

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/name.html');
});

app.get('/img', (req, res) => {
  res.sendFile(__dirname + '/Chatting-App.png');
});

app.get('/chat', (req, res) => {
  disconnectName = req.query.name;
  console.log('1111111111 ', disconnectName);
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// establishing connection between FE & BE
io.on('connection', (socket) => {

  //socket.id
  console.log('adwafaf ', socket.id);

  // a user connected functionality
  socket.on('conn', (msg1) => {
    io.emit('conn', msg1);
  });

  // current user joins the room and emits status
  socket.join("chatroom-1");
  // socket.emit('status', status);

  // console.log('59464646 ', socket.rooms.has("chatroom-1"));

  // chat message functionality
  socket.on('chat message', (data) => {
    io.emit('chat message', data);
    console.log('message: ', data);
  });

  // user is typing functionality
  socket.on('is typing', (data) => {
    io.emit('is typing', data.name + ' is typing...');
  });

  // label - online/left/is typing...
  socket.on('label', (name) => {
    if (socket.rooms.has("chatroom-1") == true) {
     status = 'online';
    }
    else {
     status = 'whatever'; 
    }
    io.emit('label', [name, status]);
  });

  // some user disconnected functionality + user leaves the room and emits status
  socket.on('disconnect', function () {
  console.log('98746541652132');
  socket.leave("room-1");
  online = false;
  // io.emit('label', [name, status]);
  io.emit('chat message', { username: disconnectName, usermessage: 'disconnected' });
  });
});
