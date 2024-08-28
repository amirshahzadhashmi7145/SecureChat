const express = require('express');
const User = require("../models/UserModel");
const Message = require("../models/MessageModel");
const auth = require("../middlewares/auth");
const cors = require("cors");

const router = express.Router();

router.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true
}));
router.use(auth);

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

module.exports = router;