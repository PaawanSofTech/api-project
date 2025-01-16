const express = require('express');
const router = express.Router();
const PostController = require('../controllers/PostController');

// Create a new post
router.post('/', PostController.createPost);

// Fetch all posts with minimal data (id, headline, content, url)
router.get('/minimal', PostController.fetchPostsMinimal);

// Fetch a single post by ID with image only
router.get('/:id/image', PostController.fetchPostImage);

// Fetch like count and check if the user liked a specific post
router.get('/:id/likes', PostController.fetchPostLikes);

// Update a post
router.put('/:id', PostController.updatePost);

// Delete a post
router.delete('/:id', PostController.deletePost);

// Like or unlike a post
router.put('/like/:id', PostController.likePost);

module.exports = router;
