const jwt = require('jsonwebtoken')

const verifyToken = (req,res,next) => {
    try{
        //check for token exist
        const token = req.cookies.token;

        if(!token)
            return res.status(403).json({message: "User forbidden"})

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.id;

        next();
        return null;
    }catch(err){
        console.error(err)
        return res.status(403).json({message: "User with invalid token"})
    }
}

module.exports = {verifyToken}