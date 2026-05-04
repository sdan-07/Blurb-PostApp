import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

//imports
import postRoutes from './routes/post.route.js'
import authRoutes from './routes/auth.route.js'

const app = express()

//middlewares
app.use(cors({
    origin: [process.env.VITE_FRONTEND_URL as string, "http://127.0.0.1:3001"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

//health check route
app.get('/', (_: Request, res: Response) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running"
    })
})

//api
app.use('/api/post', postRoutes)
app.use('/api/auth', authRoutes)

export default app
