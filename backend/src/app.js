const express = require('express')
const app = express()

//imports
const postRoutes = require('./routes/post.route')
const authRoutes = require('./routes/auth.route')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//middlewares
app.use(cors({
    origin: process.env.VITE_FRONTEND_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

//health check route
app.get('/', (_,res)=>{
    res.status(200).json({
        status: "OK",
        message: "Server is running"
    })
});

//api
app.use('/api/post', postRoutes)
app.use('/api/auth', authRoutes)


module.exports = app