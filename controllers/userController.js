const User = require('../models/User');
const jwt = require('jsonwebtoken'); // For generating a JWT token
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Verify OTP
const verifyOTP = async (req, res) => {
    const { phoneNo } = req.body;

    try {
        const user = await User.findOne({ phoneNo });

        if (user) {
            return res.status(200).json({ message: 'Phone number exists, redirecting...' });
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
    const { name, email, phoneNo, city, state, domain, password } = req.body;

    // const initialPapers = [
    //     { paperID: 'quiz_1234', status: 0, score: null, viewedAt: null, startedAt: null, completedAt: null },
    //     { paperID: 'quiz_5678', status: 0, score: null, viewedAt: null, startedAt: null, completedAt: null }
    // ];

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        // Get today's date in the format YYMMDD
        const today = new Date();
        const YYMMDD = today.getFullYear().toString().slice(-2) + 
                       (today.getMonth() + 1).toString().padStart(2, '0') + 
                       today.getDate().toString().padStart(2, '0');
        
        // Get current hour and minute (single digits for simplicity)
        const hour = today.getHours().toString().padStart(1, '0'); // Single digit hour
        const minute = today.getMinutes().toString().padStart(1, '0'); // Single digit minute

        // Find the last user registered today to get the increment number
        const lastUser = await User.findOne({
            userID: { $regex: `^${YYMMDD}-${hour}${minute}-` }
        }).sort({ userID: -1 });

        // Calculate the next user ID (incremental number U)
        const nextUserNumber = lastUser ? parseInt(lastUser.userID.split('-')[2]) + 1 : 1;

        // Construct the new userID in the format YYMMDD-HM-U
        const userID = `${YYMMDD}-${hour}${minute}-${nextUserNumber}`;

        // Create new user with the constructed userID
        const newUser = new User({
            userID,
            name,
            email,
            phoneNo,
            city,
            state,
            domain,
            password: hashedPassword,
            // papers: initialPapers
        });

        // Save the new user to the database
        await newUser.save();

        return res.status(201).json({
            message: 'User registered successfully',
            userID: newUser.userID
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};



const loginUser = async (req, res) => {
    const { email, phoneNo, password } = req.body;

    try {
        // Find user by email or phone number
        const user = await User.findOne({ $or: [{ email }, { phoneNo }] });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'yourSecretKey', { expiresIn: '1h' });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                domain: user.domain,
                paper: user.paper
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const changeDomain = async (req, res) => {
    const { userID, newDomain } = req.body;

    try {
        // Find user by userID
        const user = await User.findOne({ userID });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Define valid domains (lowercased for case-insensitive comparison)
        const validDomains = ['11th jee', '12th jee', '11th neet', '12th neet'];

        // Check if the newDomain is valid (case-insensitive check)
        if (!validDomains.includes(newDomain.toLowerCase())) {
            return res.status(400).json({ error: 'Invalid domain. It should be JEE or NEET in the correct format.' });
        }

        // Convert the domain to uppercase and update
        user.domain = newDomain.toUpperCase();
        await user.save();

        return res.status(200).json({
            message: 'Domain updated successfully',
            user: {
                name: user.name,
                email: user.email,
                phoneNo: user.phoneNo,
                city: user.city,
                state: user.state,
                domain: user.domain,
                paper: user.paper
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
    const { userID } = req.params; // userID is passed as a URL parameter

    try {
        // Find user by userID
        const user = await User.findOne({ userID });

        // Check if the user exists
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Respond with the user details
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
                paper: user.paper,
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = { registerUser, verifyOTP, loginUser, changeDomain, fetchDomain, getUserDetails };
