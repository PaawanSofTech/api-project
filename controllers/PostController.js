const Post = require('../models/Post');
const multer = require('multer');

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new post
exports.createPost = [
  upload.single('image'), // Middleware to handle file upload
  async (req, res) => {
    try {
      const { headline, content, url } = req.body;

      // Validate request
      if (!headline || !content || !req.file) {
        return res.status(400).json({ message: 'Headline, content, and image are required!' });
      }

      // Convert image to Base64
      const imageBase64 = req.file.buffer.toString('base64'); // Convert file buffer to Base64

      // Create a new post
      const post = new Post({
        headline,
        content,
        image: imageBase64, // Store Base64 string
        url: url || null, // Set `url` to null if not provided
      });

      await post.save();
      res.status(201).json({ message: 'Post created successfully!', post });
    } catch (error) {
      res.status(500).json({ message: 'Error creating post', error: error.message });
    }
  },
];

// Fetch minimal data for all posts (id, headline, content, url)
exports.fetchPostsMinimal = async (req, res) => {
  try {
    const posts = await Post.find({}, '_id headline content url createdAt').sort({ createdAt: -1 });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

// Fetch image for a specific post by ID
exports.fetchPostImage = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id, 'image');
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    res.status(200).json({ image: post.image });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching image', error: error.message });
  }
};

// Fetch like count and check if the user liked the post
exports.fetchPostLikes = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.query; // Assuming userID is passed as a query parameter

    if (!userID) {
      return res.status(400).json({ message: 'UserID is required!' });
    }

    const post = await Post.findById(id, 'likeCount');
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    const userLiked = post.likeCount.includes(userID);
    res.status(200).json({
      likeCount: post.likeCount.length,
      userLiked,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching likes', error: error.message });
  }
};

// Update a post
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { headline, content, image, url } = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      { headline, content, image, url },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    res.status(200).json({ message: 'Post updated successfully!', post });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Delete a post
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Like or unlike a post
exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID } = req.body; // Assuming userID is passed in the body


    if (!userID) {
      return res.status(400).json({ message: 'UserID is required!' });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    const userIndex = post.likeCount.indexOf(userID);

    if (userIndex === -1) {
      // User hasn't liked the post, add userID
      post.likeCount.push(userID);
    } else {
      // User has already liked the post, remove userID
      post.likeCount.splice(userIndex, 1);
    }

    await post.save();
    res.status(200).json({
      message: userIndex === -1 ? 'Post liked!' : 'Post unliked!',
      likeCount: post.likeCount.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};
