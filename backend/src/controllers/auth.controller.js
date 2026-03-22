const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const registerUser = async (req,res) => {
    try{
        const {username, email, password} = req.body;

        //password hash
        const hashedPassword = await bcrypt.hash(password, 10)
        let user;
        try{
            user = await userModel.create({username, email, password: hashedPassword})
        }catch(err){
            return res.status(409).json({message: "User already exist"})
        }

        //create token
        const token = await jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: '3h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: "production",
            sameSite: "none",
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        })

        return res.status(201).json({
            message: "User registered succesfully",
            user
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
}

const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body
        const user = await userModel.findOne({email})
        if(!user)
            return res.status(401).json({message: "Invalid Credentials"})

        const storedPassword = user.password

        //verify password
        const verifyPassword = await bcrypt.compare(password, storedPassword)
        if(!verifyPassword)
            return res.status(401).json({message: "Invalid Credentials"})

        //create token
        const token = await jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET,{
            expiresIn: '3h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: "production",
            sameSite: "none",
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        })
        
        return res.status(200).json({
            message: "User logged in succesfully"
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }
}

const logoutUser = async (_,res) => {
    try{
        res.clearCookie("token")
        
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }catch(err){
        console.error(err)
        return res.status(500).json({message: "Server error"})
    }

}

module.exports = {registerUser, loginUser, logoutUser}