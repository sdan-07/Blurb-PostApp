const postsModel = require('../models/posts.model')
const { uploadFile, deleteFile } = require('../services/storage.service')


const createPost = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Missing image file (field name: image)' })
        }
        const result = await uploadFile(req.file.buffer)
        
        if (!result || !result.url) return res.status(500).json({ message: 'Upload failed' })
        
        const userId = req.userId;

        await postsModel.create({
            image: result.url,
            fileId: result.fileId,
            caption: req.body.caption,
            user: userId,
            date: new Date().toLocaleDateString('en-US', { dateStyle: 'long' })
        })

        return res.status(201).json({
            message: "Post created"
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

const showPosts = async(req, res) => {
    try{
        const userId = req.userId;
        const posts = await postsModel.find({user: userId})
        if (posts.length === 0) return res.status(404).json({message: "No post exist"})
        
        return res.status(200).json({
            message: "All posts fetched",
            posts
        })
    }catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
}

const updatePost = async(req,res) => {
    const id = req.params.id;
    const newCaption = req.body.caption;
    if (!newCaption) {
        return res.status(400).json({ 
            message: 'Missing `caption` in request body' 
        });
    }
    try {
        const userId = req.userId;
        await postsModel.findOneAndUpdate(
            {$and: [{ _id: id }, { user: userId }]}, 
            {$set:  { caption: newCaption } },
            { new: true }
        );

        const post = await postsModel.findOne({_id: id})

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({
            message: 'Post edited successfully',
            post
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

const deletePost = async (req,res) => {
    try{
        const userId = req.userId;
        const postId = req.params.id;
        if(!postId)
            return res.status(404).json({message: "Post not found"})

        const post = await postsModel.findOne({ $and:[{ user: userId }, { _id: postId }] })
        if (!post) {
            return res.status(404).json({message: "Post not found"})
        }

        // Delete from ImageKit
        if (post.fileId) {
            await deleteFile(post.fileId)
        }

        // Delete from database
        await postsModel.deleteOne({ $and:[{ user: userId }, { _id: postId }] })

        return res.status(200).json({message: "Post deleted successfully"})

    }catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { createPost, showPosts, updatePost, deletePost }