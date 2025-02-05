const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

// Create a new post
router.post('/', PostController.createPost);

router.get('/posts', PostController.fetchPost);

// Update a post
router.put('/:id', PostController.updatePost);

// Delete a post
router.delete('/:id', PostController.deletePost);

// Like or unlike a post
router.put('/like/:id', PostController.likePost);

module.exports = router;
