const express = require('express');
const multer = require('multer');  // Import multer
const router = express.Router();
const { 
    verifyPhone, 
    registerUser, 
    changeDomain, 
    fetchDomain, 
    getUserDetails, 
    updateProfileImage,
    updateProfile 
} = require('../controllers/userController');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });  // Define upload using memory storage

// Verify OTP
router.post('/verify-number', verifyPhone);

// Register User
router.post('/register', registerUser);

// Change Domain
router.post('/change-domain', changeDomain);

// Fetch Domain
router.get('/fetch-domain/:userID', fetchDomain);

// Fetch User Details by userID
router.get('/:userID', getUserDetails);

// Update Profile Image
router.post('/update-profile-image', upload.single('profileImage'), updateProfileImage);

// update profile
router.post('/update-profile', updateProfile);

module.exports = router;
