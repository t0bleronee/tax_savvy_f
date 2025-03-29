const mongoose = require('mongoose');
const {localDB}= require('../TaxCalculator/config/db'); // Import the LocalDB connection
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = localDB.model('users', UserSchema);
module.exports = UserModel;