const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const cors = require("cors");
const jwt_secret = process.env.JWT_SECRET;

const router = express.Router();

router.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","POST"],
    credentials: true
}));

router.get("/api/oops", (req, res) => {
    res.send("Ok ok")
})

router.post("/api/login", async (req,res) => {
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

router.post("/api/register", async (req,res) => {
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

router.post("/api/logout", (req, res) => {
    // Clear the user's session or token (depending on your authentication setup)
    res.clearCookie('token'); // Assuming you stored the token in a cookie

    // You may want to perform additional cleanup or log user out of other services

    res.status(200).json({ message: "Logout successful" });
});

router.get("/api/getCurrentUserId", (req,res) => {
    const token = req.cookies.token;
    if(!token) {
        return res.status(401).send("Unauthorized")
    }
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

module.exports = router;