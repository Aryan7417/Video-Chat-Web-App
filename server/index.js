const express = require('express')
const bodyParser = require('body-parser')
const { Server, Socket } = require('socket.io')

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const app = express()


app.use(bodyParser.json())  


const emailToSocketMapping = new Map();


io.on("connection", (socket) => {
    console.log("new Connection")

    socket.on("join-room", (data) => {
        const { roomId, emailId } = data
        console.log("user", emailId, "joined Room", roomId)
        emailToSocketMapping.set(emailId, socket.id)
        socket.join(roomId)
        socket.emit('joined-room',{roomId})
        socket.broadcast.to(roomId).emit("user-joined", { emailId })

    }) 
})


app.listen(8000, () => (
    console.log("http server running at port 8000")
))

io.listen(8001);