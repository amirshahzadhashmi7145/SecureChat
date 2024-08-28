const {Server} = require('socket.io');
const {createServer} = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 8000
require('dotenv').config();
const Mongo_Url = process.env.MONGO_URI;
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');


const connectWithRetry = () => {
    mongoose.connect(Mongo_Url)
        .then(() => {
            console.log("Connected mongo")
        })
        .catch((error) => {
            console.log(error);
            setTimeout(connectWithRetry, 5000);
        })
}

connectWithRetry();

app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use('/',userRoutes)
app.use('/auth',chatRoutes);

//socketIO Configurations
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"],
        credentials: true
    },
});

//ScoketIo api's
io.on("connection", (socket) => {
    console.log(`Connected user and id is ${socket.id}`)

    socket.on('joinRoom',(data) => {
        socket.leave(socket.id);
        socket.join(data.roomName)
        console.log(socket.rooms);
    })

    socket.on('privateMessage',(data) => {
        io.to(data.receiverId).emit("newMessage", {message:data.message,senderId:data.senderId,receiverId:data.receiverId});
    })

    socket.on('disconnect', () => {
        console.log(socket.id + " is Disconnected from the server");
    })
})

server.listen(8000,() => {
    console.log(`Server started on ${port}`)
})