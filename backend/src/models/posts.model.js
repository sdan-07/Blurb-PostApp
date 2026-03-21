const mongoose = require('mongoose')

const postsSchema = new mongoose.Schema({
    image: String,
    fileId: String,
    caption: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    date: String
})

const postsModel = mongoose.model("posts", postsSchema);

module.exports = postsModel