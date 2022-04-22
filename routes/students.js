const express = require('express');
const router = express.Router();
const Submission = require('../models/Submissions');
const User = require('../models/Users');
const Assessment = require('../models/Assessments');
const mongoose = require('mongoose');
const { submissionValidation } = require('../validations/validations');
const { cast } = require('@hapi/joi/lib/base');
const authentication = require('../authentication');


//CREATE ASSESSMENT SUBMISSION
router.post('/student/submit-assessment', authentication, async (req, res) => {

    //validate details before creating an assessment submission object
    const { error } = submissionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if assessmentID is a valid ID in database
    const castedStudentID = mongoose.Types.ObjectId(req.body.studentID);
    const castedAssessmentID = mongoose.Types.ObjectId(req.body.assessmentID);
    const castedMentorID = mongoose.Types.ObjectId(req.body.mentorID);
    const studentExists = await User.findById({ _id: castedStudentID });
    const assessmentExists = await Assessment.findById({ _id: castedAssessmentID });
    const mentorExists = await User.findById({ _id: castedMentorID });

    //create a new assessment submission object
    const assessmentSubmission = new Submission({
        link: req.body.link,
        studentID: req.body.studentID,
        assessmentID: req.body.assessmentID,
        mentorID: req.body.mentorID
    });

    //save assessment submission to mongo db
    try {
        const savedSubmission = await assessmentSubmission.save();
        if (savedSubmission) res.send({ success: "Your submission for this assessment was saved successfully!" });
    }

    catch (error) {
        res.status(400).send(error);
    }

});

//VIEW SUBMISSIONS
router.get('/student/view-submissions/:id', authentication, async (req, res) => {

    try {

        //check if student has submissions in database and then display them all
        const castedID = mongoose.Types.ObjectId(req.params.id);
        const submissionExists = await Submission.find({ studentID: castedID });
        if (!submissionExists) return res.status(400).send('You do not have any submissions');
        res.send({ yourSubmissions: submissionExists })
    }

    catch (error) {
        res.send(error);

    }
});

//SELECT A SUBMISSION
router.get('/student/select-submission/:id', authentication, async (req, res) => {

    try {
        //check if submission is available in database and then display it
        const submissionExists = await Submission.findById(req.params.id);
        if (!submissionExists) return res.status(400).send('This submission does not exist.');
        res.send({ selectedSubmission: submissionExists })

    } catch (error) {
        res.send(error);

    }
});

module.exports = router;