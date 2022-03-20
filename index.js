const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // whatever is at ./index.html the browser will render that.
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// io.on('connection', (socket) => {          // whenever the connection event happens(when someone opens the browser and type localhost:3000/) the corresponding function will be executed
//   io.emit('connected');  // <<<< HERE >> socket.emit('connected');
//   socket.on('disconnect', function(){
//     io.emit('disconnect');
//   });
  io.on('connection', (socket) => {          // whenever the connection event happens(when someone opens the browser and type localhost:3000/) the corresponding function will be executed
    let username1 = "anonymous";

    const randomStr = (n=10) => [...Array(n)]
    .map(e => String.fromCharCode(~~(Math.random() * 26) + 97))
    .join("");

    socket.on('conn', (msg1) => {
      io.emit('conn', msg1);
    });
    socket.on('chat message', (data) => {   // whenever the chat message event happens the corresponding function will be executed. Here, msg is same as input.value in index.html
      if( data.username )
      {
        username1 = data.username;
      }
      // for making a random username.
      else
      {
        username1 = randomStr();
      }
      io.emit('chat message', username1 +": "+ data.usermessage);
      console.log('mesage: ', data);
    });
    socket.on('disconnect', function() {
      io.emit('chat message', 'some user disconnected');
   });
});
