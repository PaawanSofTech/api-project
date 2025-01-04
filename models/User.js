const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    userID: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNo: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    domain: { type: String, required: true },
    papers: [
        {
            paperID: { type: String, required: true },
            status: { type: Number, default: 0 }, // Binary flag for paper status
            score: { type: Number, default: null },
            viewedAt: { type: Date, default: null },
            startedAt: { type: Date, default: null },
            completedAt: { type: Date, default: null }
        }
    ],
    password: { type: String, required: true }
});

// Compare entered password with the hashed password in DB
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
