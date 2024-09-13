const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io");
const io = new Server(server);
const mongoose = require('mongoose')
const port = 3000

mongoose.connect('mongodb://localhost/users')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view-engine', 'ejs')

app.get('/', (req, res) => {
  res.send("Home Page")
})

const usersRouter = require('./routes/userRoute/users');
const chatRouter = require('./routes/chatRoute/chat')(io)

app.use("/users", usersRouter)
app.use("/chat", chatRouter)

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})