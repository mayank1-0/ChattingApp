const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var disconnectName;
var online = 0;

// sqlite related code
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.db3');

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
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS chats (sender TEXT, message TEXT)");                   // Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data. The function returns the Database object for which it was called to allow for function chaining.

      const stmt = db.prepare("INSERT INTO chats VALUES (?,?)");    // Prepares the SQL statement and optionally binds the specified parameters and calls the callback when done.
      stmt.run(data.username, data.usermessage);                                 //Binds parameters and executes the statement. The function returns the Statement object to allow for function chaining.
      stmt.finalize();                                            // This is typically optional, but if you experience long delays before the next query is executed, explicitly finalizing your statement might be necessary
  
      db.each("SELECT * FROM chats", (err, row) => {  // Runs the SQL query with the specified parameters and calls the callback once for each result row. 
          console.log(row.sender + ": " + row.message);
      });
  });
  
  // db.close();                                                         // Closes the database.
    io.emit('chat message', data);
  });

  // some user disconnected functionality
  socket.on('disconnect', function () {
    if( online = 0 ){
      io.emit('chat message1', {username: disconnectName, usermessage: 'disconnected'});
    }
  });
});
