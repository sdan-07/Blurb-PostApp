const express = require('express')
const router = express.Router()

//middleware
const multer = require('multer')
const upload = multer({storage: multer.memoryStorage()})

//import
const authMiddleware = require('../middlewares/auth.middleware')
const postController = require('../controllers/post.controller')

//routes
router.post('/create-post', authMiddleware.verifyToken, upload.single('image'), postController.createPost)

router.get('/fetch', authMiddleware.verifyToken, upload.none(), postController.showPosts)

router.patch('/update-post/:id', authMiddleware.verifyToken, upload.none(), postController.updatePost)

router.delete('/delete-post/:id', authMiddleware.verifyToken, upload.none(), postController.deletePost)


module.exports = router