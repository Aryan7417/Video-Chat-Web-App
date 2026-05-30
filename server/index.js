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
const socketToEmailMapping = new Map()


io.on("connection", (socket) => {
  console.log("new Connection")

  socket.on("join-room", (data) => {
    const { roomId, emailId } = data
    console.log("user", emailId, "joined Room", roomId)
    emailToSocketMapping.set(emailId, socket.id)
    socketToEmailMapping.set(socket.id, emailId)
    socket.join(roomId)
    socket.emit('joined-room', { roomId })
    socket.broadcast.to(roomId).emit("user-joined", { emailId })

  })
  socket.on('call-user', data => {
    const { emailId, offer } = data
    const fromEmail = socketToEmailMapping.get(socket.id)

    const socketId = emailToSocketMapping.get(emailId)
    socket.to(socketId).emit("incomming-call", {
      from: fromEmail,
      offer
    });
  })

  socket.on("call-accepted", (data) => {
    const { emailId, ans } = data;
    const socketId = emailToSocketMapping.get(emailId)
    socket.to(socketId).emit("call-accepted", { ans });


  })
  socket.on("peer:nego:needed", ({ offer, emailId }) => {
  const socketId = emailToSocketMapping.get(emailId);

  socket.to(socketId).emit("peer:nego:needed", {
    offer,
    from: socketToEmailMapping.get(socket.id),
  });
});

socket.on("peer:nego:done", ({ ans, emailId }) => {
  const socketId = emailToSocketMapping.get(emailId);

  socket.to(socketId).emit("peer:nego:final", {
    ans,
  });
});

})


app.listen(8000, () => (
  console.log("http server running at port 8000")
))

io.listen(8001);