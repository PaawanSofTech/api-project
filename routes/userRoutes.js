const express = require('express');
const router = express.Router();
const { verifyOTP, registerUser, loginUser, changeDomain, fetchDomain, getUserDetails } = require('../controllers/userController');

// Verify OTP
router.post('/verify-otp', verifyOTP);

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);  // New login route

router.post('/change-domain', changeDomain);

router.get('/fetch-domain/:userID', fetchDomain);

// Add the route to fetch user details by userID
router.get('/:userID', getUserDetails);

module.exports = router;
