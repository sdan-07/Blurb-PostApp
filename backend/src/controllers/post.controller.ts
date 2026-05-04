import { Request, Response } from 'express'
import postsModel from '../models/posts.model.js'
import userModel from '../models/user.model.js'
import { uploadFile, deleteFile } from '../services/storage.service.js'

export const createPost = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Missing image file (field name: image)' })
            return
        }
        const result = await uploadFile(req.file.buffer)

        if (!result || !result.url) {
            res.status(500).json({ message: 'Upload failed' })
            return
        }

        const userId = req.userId

        await postsModel.create({
            image: result.url,
            fileId: result.fileId,
            caption: req.body.caption,
            user: userId,
            date: new Date().toLocaleDateString('en-US', { dateStyle: 'long' })
        })

        res.status(201).json({
            message: "Post created"
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export const showPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId
        const user = await userModel.findById(userId).select("-password")
        const posts = await postsModel.find({ user: userId })
        
        res.status(200).json({
            message: "All posts fetched",
            user,
            posts: posts || []
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Server error" })
    }
}

export const updatePost = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id
    const newCaption = req.body.caption
    if (!newCaption) {
        res.status(400).json({
            message: 'Missing `caption` in request body'
        })
        return
    }
    try {
        const userId = req.userId
        await postsModel.findOneAndUpdate(
            { $and: [{ _id: id }, { user: userId }] },
            { $set: { caption: newCaption } },
            { new: true }
        )

        const post = await postsModel.findOne({ _id: id })

        if (!post) {
            res.status(404).json({ message: 'Post not found' })
            return
        }

        res.status(200).json({
            message: 'Post edited successfully',
            post
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId
        const postId = req.params.id
        if (!postId) {
            res.status(404).json({ message: "Post not found" })
            return
        }

        const post = await postsModel.findOne({ $and: [{ user: userId }, { _id: postId }] })
        if (!post) {
            res.status(404).json({ message: "Post not found" })
            return
        }

        // Delete from ImageKit
        if (post.fileId) {
            await deleteFile(post.fileId)
        }

        // Delete from database
        await postsModel.deleteOne({ $and: [{ user: userId }, { _id: postId }] })

        res.status(200).json({ message: "Post deleted successfully" })

    } catch (err) {
        console.error(err)
        res.status(500).json({ message: 'Server error' })
    }
}
