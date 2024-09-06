const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3000

app.get('/', (req, res) => {
  res.send("Home Page")
})

const usersRouter = require('./routes/users')
const chatRouter = require('./routes/chat')(io)

app.use("/users", usersRouter)
app.use("/chat", chatRouter)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})