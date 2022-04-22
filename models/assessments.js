const mongoose = require('mongoose');


//assessment schema
const assessmentSchema = mongoose.Schema(
    {
        title:
        {
            type: String,
            required: true,
            min: 6
        },

        description:
        {
            type: String,
            required: true,
            min: 10

        },

        mentorID:
        {
            type: String,
            required: true,
            min: 12
        },

        createdAt:
        {
            type: Date,
            default: Date.now
        },

        updatedAt:
        {
            type: Date,
            default: Date.now
        },

        deadline:
        {
            type: Date,
            default: Date.now
        }
    });

module.exports = mongoose.model('Assessments', assessmentSchema);