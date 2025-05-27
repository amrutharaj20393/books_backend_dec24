//import mongoose
const mongoose = require('mongoose')

const userSchmea = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: 'Bookstore User'
    }
})

const users = mongoose.model('users', userSchmea)
module.exports = users