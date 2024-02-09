const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET

var hell = true;

module.exports = auth = (req,res,next) => {
    try {
        var decoded = jwt.verify(req.cookies.token, jwt_secret);
    } catch(err) {
        res.status(500).send("Server Error")
    }
    if(decoded){
        next();
    }
    else{
        return res.status(401).send("Auth Error")
    }
}