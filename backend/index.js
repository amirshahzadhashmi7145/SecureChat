const {Server} = require('socket.io');
const {createServer} = require("http");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/UserModel');
const Message = require('./models/MessageModel');
const mongoose = require('mongoose');
const app = express();
const router = express.Router();
const port = process.env.PORT || 8000
const auth = require('./middlewares/auth');
require('dotenv').config();
const Mongo_Url = process.env.MONGO_URI;
const jwt_secret = process.env.JWT_SECRET


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

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true
}));

//socketIO Configurations
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET","POST"],
        credentials: true
    },
});

//middlewares
app.use("/auth",router);
router.use(auth);
router.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true
}));

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


//App Api's
app.get("/",(req,res) => {
    res.send("OOPS")
})

app.get("/getCurrentUserId",(req,res) => {
    const token = req.cookies.token;
    try {
        var decoded = jwt.verify(token, jwt_secret);
    } catch(err) {
        res.status(500).send("Server Error")
    }
    if(decoded){
        const userId = decoded.userId;
        return res.status(200).json({userId})
    }
    else{
        res.status(401).send("Unauthorized")
    }

})

app.post("/register", async (req,res) => {
    try {
        const {name,username,email,password} = req.body;
        const user = await User.findOne({username:username});
        if(user){
            res.status(409).json({error:"Email and Username must be unique"})
        }
        else{
            bcrypt.hash(password,10)
                .then(async hash => {
                    const user = new User({name, username, email, password: hash});
                    await user.save();
                    res.status(200).json("User created successfully");
                })
        }

    }catch (e) {
        res.status(500).json({error:e.message});
    }
})

app.post("/login", async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username: username});
                if(!user) {
                    return res.status(404).json("Credentials not correct")
                }
                else{
                    bcrypt.compare(password,user.password)
                        .then(function (result) {
                        if(result) {
                            const token = jwt.sign({userId:user._id},jwt_secret,{expiresIn: '1d'});
                            res.cookie('token', token,{sameSite:'None',secure:true});
                            return res.json({Status: 'Success',userId:user._id,name:user.name});
                        }
                        else{
                            return res.status(401).json("Credentials not correct")
                        }
                    });
                }
    }catch (e) {
        res.status(500).json({error:e.message});
    }
})

app.post("/logout", (req, res) => {
    // Clear the user's session or token (depending on your authentication setup)
    res.clearCookie('token'); // Assuming you stored the token in a cookie

    // You may want to perform additional cleanup or log user out of other services

    res.status(200).json({ message: "Logout successful" });
});



//Route Api's
router.get("/chat",(req,res) => {
    res.send("OOPS Chats here")
})

router.get("/getAllUsers", async (req,res) => {
    try{
        const users = await User.find({});
        if(!users) {
            res.status(404).json({message: "No User Found!"});
        }
        else{
            res.status(200).json(users);
        }
    }catch (e) {
        res.status(500).json({error:e.message})
    }
})

//need improvement as whether both users exist?
router.post("/sendMessage", async (req,res) => {
    try {
        const {senderId,recipient,text} = req.body;
        const message = new Message({senderId,recipient,text});
        await message.save();
        res.status(200).json("Message saved successfully")
    }catch (e) {
        res.status(500).json({error:e.message})
    }
})

router.get('/:senderId/:recipientId', async (req, res) => {
    try {
        const {senderId, recipientId} = req.params;
        const limit = parseInt(req.query.limit) || 10; // Set a default limit of 10 messages

        // Find the users by IDs
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        // Check if both users exist
        if (!sender || !recipient) {
            return res.status(404).json({ error: 'Sender or recipient not found.' });
        }

        // Get the last 10 messages between the sender and recipient
        const messages = await Message.find({
            $or: [
                { senderId: senderId, recipient: recipientId },
                { senderId: recipientId, recipient: senderId },
            ],
        })
            .sort({ timestamp: -1 })
            .limit(20);// Re-sort to get messages in ascending order based on timestamp

        messages.sort();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



server.listen(8000,() => {
    console.log(`Server started on ${port}`)
})