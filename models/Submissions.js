const mongoose = require('mongoose');


//submissions schema
const submissionsSchema = mongoose.Schema(
    {
        link:
        {
            type: String,
            required: true
        },

        studentID:
        {
            type: String,
            required: true
        },


        assessmentID:
        {
            type: String,
            required: true
        },

        mentorID:
        {
            type: String,
            required: true
        },

        gradeMark:
        {
            type: String,
            default: "This submission has not yet been graded."
        },

        mentorsRemarks:
        {
            type: String,
            default: "There are no remarks yet for this submission."
        },

        submissionDate:
        {
            type: Date,
            default: Date.now
        },

        updatedAt:
        {
            type: Date,
            default: Date.now
        }
    });

module.exports = mongoose.model('Submissions', submissionsSchema);