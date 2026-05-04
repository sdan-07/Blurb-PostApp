import { Request, Response } from 'express'
import userModel from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password } = req.body

        //password hash
        const hashedPassword = await bcrypt.hash(password, 10)
        let user
        try {
            user = await userModel.create({ username, email, password: hashedPassword })
        } catch (err) {
            res.status(409).json({ message: "User already exist" })
            return
        }

        //create token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET as string, {
            expiresIn: '3h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        })

        const userResponse = await userModel.findById(user._id).select("-password")
        
        res.status(201).json({
            message: "User registered succesfully",
            user: userResponse
        })
        return
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            res.status(401).json({ message: "Invalid Credentials" })
            return
        }

        const storedPassword = user.password

        //verify password
        const verifyPassword = await bcrypt.compare(password, storedPassword)
        if (!verifyPassword) {
            res.status(401).json({ message: "Invalid Credentials" })
            return
        }

        //create token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET as string, {
            expiresIn: '3h'
        })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 3 * 60 * 60 * 1000 // 3 hours
        })

        const userResponse = await userModel.findById(user._id).select("-password")

        res.status(200).json({
            message: "User logged in succesfully",
            user: userResponse
        })
        return
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export const logoutUser = async (_: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}
