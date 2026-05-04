import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

interface JwtPayload {
    id: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
        //check for token exist
        const token = req.cookies.token

        if (!token) {
            res.status(403).json({ message: "User forbidden" })
            return
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
        req.userId = decoded.id

        next()
    } catch (err) {
        console.error(err)
        res.status(403).json({ message: "User with invalid token" })
    }
}
