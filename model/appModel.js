

const mongoose = require('mongoose')
const applicationSchmea = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    jobtitle: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    coverletter: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    }
})

const applications = mongoose.model('applications', applicationSchmea)
module.exports = applications