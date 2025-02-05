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
    
    // Return isLiked (boolean) and the updated like count
    res.status(200).json({
      isLiked: userIndex === -1,
      likes: post.likeCount.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling like', error: error.message });
  }
};

// Get posts with pagination
exports.fetchPost = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const userID = req.query.userID; // Get userID from query parameters
    const skip = (page - 1) * limit;

    // Fetch posts with pagination
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip(skip) // Skip previous pages' data
      .limit(limit); // Limit the number of posts fetched

    // Count total documents in the collection
    const totalPosts = await Post.countDocuments();

    // Add user-specific like status and like count to posts
    const updatedPosts = posts.map(post => {
      // Check if the user has liked this post
      const isLiked = post.likeCount.includes(userID); // true if userID is in the likeCount array
      const likeCount = post.likeCount.length; // Number of likes is the length of the likeCount array

      return {
        id: post._id, // Use post's MongoDB id
        image: post.image || '', // Placeholder for base64 image (empty if not present)
        headline: post.headline,
        content: post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content, // Truncate content if too long
        date: post.createdAt.toISOString().split('T')[0], // Format date (YYYY-MM-DD)
        likes: likeCount,
        url: post.url || '', // Provide url if exists
        isLiked: isLiked, // True/false based on userID's presence in the likeCount array
      };
    });

    // Response with data and pagination details
    res.status(200).json({
      posts: updatedPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};


