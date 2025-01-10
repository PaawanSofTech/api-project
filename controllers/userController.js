const multer = require('multer');
const User = require('../models/User');
const jwt = require('jsonwebtoken'); // For generating a JWT token
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Verify Number
const verifyPhone = async (req, res) => {
    const { phoneNo } = req.body;

    try {
        const user = await User.findOne({ phoneNo });

        if (user) {
            // Return user data if the phone number exists
            const responseUserData = {
                userID: user.userID,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                domain: user.domain,
                profilePicture: user.profilePicture
            };
            return res.status(200).json({
                message: 'Phone number exists, redirecting...',
                user: responseUserData
            });
        } else {
            return res.status(404).json({ error: 'Phone number not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Register a new user
const registerUser = async (req, res) => {
    const { name, email, phoneNo, city, state, domain } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const namePart = name.replace(/\s+/g, '').slice(0, 4).toUpperCase();
        const phonePart = phoneNo.slice(-4);
        const randomPart = Math.floor(100000 + Math.random() * 900000);
        const userID = `${namePart}${phonePart}${randomPart}`;

        const newUser = new User({
            userID,
            name,
            email,
            phoneNo,
            city,
            state,
            domain,
            papers: [],
            courses: [],
            doubts: [],
            profilePicture: null
        });

        await newUser.save();

        const responseUserData = {
            userID: newUser.userID,
            name: newUser.name,
            email: newUser.email,
            phoneNo: newUser.phoneNo,
            city: newUser.city,
            state: newUser.state,
            domain: newUser.domain,
            profilePicture: newUser.profilePicture
        };

        return res.status(201).json({
            message: 'User registered successfully',
            user: responseUserData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update Profile Image
const updateProfileImage = async (req, res) => {
    const { userID, image } = req.body;

    try {
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Ensure the image is properly formatted (e.g., valid Base64 or URL)
        if (typeof image !== 'string') {
            return res.status(400).json({ error: 'Invalid image format' });
        }

        // Update the profile picture
        user.profilePicture = image;
        await user.save();

        return res.status(200).json({
            message: 'Profile image updated successfully',
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const updateProfile = async (req, res) => {
    const { userID, name, email, city, state } = req.body;
  
    try {
      const user = await User.findOne({ userID });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user details
      user.name = name || user.name;
      user.email = email || user.email;
      user.city = city || user.city;
      user.state = state || user.state;
  
      await user.save();
  
      // Return updated user data
      res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          userID: user.userID,
          profilePicture: user.profilePicture,
          name: user.name,
          email: user.email,
          phoneNo: user.phoneNo,
          city: user.city,
          state: user.state,
          domain: user.domain,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

const changeDomain = async (req, res) => {
    const { userID, newDomain } = req.body;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.domain = newDomain;
        await user.save();

        return res.status(200).json({
            message: 'Domain updated successfully',
            user: {
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                domain: user.domain
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const fetchDomain = async (req, res) => {
    const { userID } = req.params;

    try {
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'Domain fetched successfully',
            domain: user.domain
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserDetails = async (req, res) => {
    const { userID } = req.params; 

    try {
        const user = await User.findOne({ userID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
            message: 'User details fetched successfully',
            user: {
                userID: user.userID,
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                domain: user.domain,
                profilePicture: user.profilePicture,
                papers: user.papers,
                courses: user.courses,
                doubts: user.doubts
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { 
    registerUser, 
    verifyPhone, 
    changeDomain, 
    fetchDomain, 
    getUserDetails, 
    updateProfileImage,
    updateProfile
};
