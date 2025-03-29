// Imports
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserModel = require('./user');
const router = express.Router();

// MongoDB Connection (Fix localhost typo)
mongoose.connect('mongodb://127.0.0.1:27017/user', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

// ===============================
// ✅ Register API
// ===============================
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error registering user' });
    }
});

// ===============================
// ✅ Login API
// ===============================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error logging in' });
    }
});

module.exports = router; 