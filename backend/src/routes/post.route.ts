import { Router } from 'express'
import multer from 'multer'

//middleware
const upload = multer({ storage: multer.memoryStorage() })

//import
import { verifyToken } from '../middlewares/auth.middleware.js'
import { createPost, showPosts, updatePost, deletePost } from '../controllers/post.controller.js'

const router = Router()

//routes
router.post('/create-post', verifyToken, upload.single('image'), createPost)

router.get('/fetch', verifyToken, upload.none(), showPosts)

router.patch('/update-post/:id', verifyToken, upload.none(), updatePost)

router.delete('/delete-post/:id', verifyToken, upload.none(), deletePost)

export default router
