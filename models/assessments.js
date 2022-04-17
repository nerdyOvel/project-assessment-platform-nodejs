const mongoose = require('mongoose');


//assessment schema
const assessmentSchema = mongoose.Schema(
    {
        title:
        {
            type: String,
            required: true
        },

        description:
        {
            type: String,
            required: true
        },

        mentor:
        {
            type: String,
            required: true
        },

        mentorID:
        {
            type: Number,
            required: true
        },

        createdAt:
        {
            type: Date,
            default: Date.now
        },

        deadline:
        {
            type: String,
            required: true
        },
    });

module.exports = mongoose.model('Assessments');