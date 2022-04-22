const express = require('express');
const router = express.Router();
const Submission = require('../models/Submissions');
const mongoose = require('mongoose');
const { gradeSubmissionValidation } = require('../validations/validations');
const bcrypt = require('bcrypt');


//GRADE SUBMISSIONS
router.put('/mentor/grade-submission/:id', async (req, res) => {

    //validate details before creating a mentor object
    const { error } = gradeSubmissionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        //check if submission exists in database
        const castedID = mongoose.Types.ObjectId(req.body.submissionID);
        const submissionExists = await Submission.findById({ _id: castedID });
        if (!submissionExists) return res.status(400).send('This submission does not exist');
        console.log(req.body.gradeMark);
        console.log(req.body.mentorsRemarks);

        //update grade and remarks for the found submission
        const query = {
            gradeMark: req.body.gradeMark,
            mentorsRemarks: req.body.mentorsRemarks,
            updatedAt: Date.now()
        };
        const updateGrade = await Submission.findByIdAndUpdate(req.params.id, query);

        if (updateGrade) res.status(200).send({ sucess: "You successfully graded this submission!" })

    }

    catch (error) {

        res.status(400).send(error);

    }

});

//VIEW SUBMISSIONS FOR AN ASSESSMENT
router.get('/mentor/view-submissions/:assessID', async (req, res) => {

    try {

        //check if there are submissions for an assessment in database and then display them all
        const castedID = mongoose.Types.ObjectId(req.params.assessID);
        const submissionsExists = await Submission.find({ assessmentID: castedID });

        if (!submissionsExists) return res.status(400).send('There are no submissions yet for this assessment');

        res.send({ submissions: submissionsExists })
    }

    catch (error) {
        res.send(error);

    }

});
//SELECT A SUBMISSION
router.get('/mentor/select-submission/:id', async (req, res) => {

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