const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userID: { type: String, unique: true, required: true },
    profilePicture: { type: String, default: null }, // Renamed field
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    domain: { type: String, required: true },
    papers: [
        { type: String, required: true } // Array of paper IDs
    ],
    courses: [
        { type: String, required: true } // Array of course IDs
    ],
    doubts: [
        { type: String, required: true } // Array of doubt IDs
    ]
});

module.exports = mongoose.model('User', UserSchema);