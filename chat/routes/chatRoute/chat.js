const express = require('express')
const router = express.Router()

var returnRouter = function (io) {
    router.get('/', (req, res) => {
        res.sendFile('index.html', { root: __dirname });
    })

    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            socket.broadcast.emit('chat message', msg);
        });
    });

    return router
}

module.exports = returnRouter