const mongoose = require('mongoose')
const jobSchmea = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jtype: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const Jobs = mongoose.model('Jobs', jobSchmea)
module.exports = Jobs