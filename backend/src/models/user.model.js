const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel