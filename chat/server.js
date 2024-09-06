const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000

app.get('/', (req, res) => {
  res.sendFile('index.html' , { root : __dirname});
})

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})