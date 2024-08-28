const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwt_secret = process.env.JWT_SECRET

module.exports = auth = (req,res,next) => {
    if(!req.cookies.token) {
        return res.status(401).send("Auth Error")
    }
    try {
        var decoded = jwt.verify(req.cookies.token, jwt_secret);
        if(decoded){
            next();
        }
        else{
            return res.status(401).send("Auth Error")
        }
    } catch(err) {
        return res.status(500).send("Server Error")
    }
}