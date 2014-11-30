var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('chat message', function(msg) {
    console.log('message: ' + msg);
  });
  setTimeout(function() {
    socket.emit("event_name", "LOL NERD");
  }, 500);
});

http.listen(8000, function() {
  console.log('listening on *:8000');
});
