const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Assessment = require('../models/Assessments');
const Submission = require('../models/Submissions');
const mongoose = require('mongoose');
const { userRegValidation, loginValidation, assessmentValidation, gradeSubmissionValidation, submissionValidation } = require('../validations/validations');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const authentication = require('../authentication');

//ADD ASSESSMENT
router.post('/admin/create-assessment', authentication, async (req, res) => {

    //validate details before creating an assessment object
    const { error } = assessmentValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if mentorID is a valid ID in database
    const castedID = mongoose.Types.ObjectId(req.body.mentorID);
    const mentorExists = await User.findById({ _id: castedID });
    // if (mentorExists.role !== 2) return res.status(400).send({ failure: 'Input a valid mentor ID' });

    //create a new assessment object
    const assessment = new Assessment({
        title: req.body.title,
        description: req.body.description,
        mentorID: req.body.mentorID
    });

    //save assessment mongo db
    try {
        const savedAssessment = await assessment.save();
        if (savedAssessment) res.send({ message: "New Assessment Saved Successfully!" });
    }

    catch (error) {
        res.status(400).send(error);
    }

});

//EDIT ASSESSMENT
router.put('/admin/edit-assessment/:id', authentication, async (req, res) => {

    try {
        //check if assessment exists in database
        const assessmentExists = await Assessment.findById(req.params.id);

        if (!assessmentExists) return res.status(400).send({ failure: 'This assessment does not exist!' });

        //check if details to update were sent
        if (Object.keys(req.body).length === 0) return res.status(400).send({ failure: "Enter a field you want to update!" })

        const editAssesment = await Assessment.findByIdAndUpdate(req.params.id, req.body);

        if (editAssesment) {
            const updateTime = await Assessment.findByIdAndUpdate(req.params.id, { updatedAt: Date.now() });
            if (updateTime) res.status(400).send({ success: "You successfully updated this assessment!" })
        }

    }

    catch (error) {

    }
});

//DELETE ASSESSMENT
router.delete('/admin/delete-assessment/:id', authentication, async (req, res) => {

    try {

        //check if assessment exists in database
        const assessmentExists = await Assessment.findById(req.params.id);
        if (!assessmentExists) return res.status(400).send({ failure: 'This assessment does not exist' });

        //Delete assessment
        const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);
        if (deletedAssessment) res.status(200).send({ success: "You successfully deleted this assessment!" })
    }

    catch (error) {

        res.status(400).send(error);

    }

});

//CREATE ASSESSMENT SUBMISSION
router.post('/admin/submit-assessment', authentication, async (req, res) => {

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

    if (studentExists.role !== 1) return res.status(400).send({ failure: 'Input a valid student ID' });
    if (!assessmentExists) return res.status(400).send({ failure: 'Input a valid assessment ID' });
    if (mentorExists.role !== 2) return res.status(400).send({ failure: 'Input a valid mentor ID' });

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

//EDIT ASSESSMENT SUBMISSION
router.put('/admin/edit-submission/:id', authentication, async (req, res) => {

    try {
        //check if submission exists in database
        const submissionExists = await Submission.findById(req.params.id);

        if (!submissionExists) return res.status(400).send({ failure: 'This submission does not exist' });

        //check if details to update were sent
        if (Object.keys(req.body).length === 0) return res.status(400).send({ failure: "Enter a field you want to update!" })

        const editSubmission = await Submission.findByIdAndUpdate(req.params.id, req.body);

        if (editSubmission) {
            const updateTime = await Submission.findByIdAndUpdate(req.params.id, { updatedAt: Date.now() });
            if (updateTime) res.status(400).send({ success: "You successfully updated this submission!" })
        }

    }


    catch (error) {

    }
});


//DELETE ASSESSMENT SUBMISSION
router.delete('/admin/delete-submission/:id', authentication, async (req, res) => {

    try {

        //check if submission exists in database
        const submissionExists = await Submission.findById(req.params.id);
        if (!submissionExists) return res.status(400).send({ failure: 'This submission does not exist' });

        //Delete submission
        const deletedSubmission = await Submission.findByIdAndDelete(req.params.id);
        if (deletedSubmission) res.status(200).send({ success: "You successfully deleted this submission!" })
    }

    catch (error) {

        res.status(400).send(error);

    }

});

//GRADE ASSESSMENT SUBMISSION
router.put('/admin/grade-submission/:id', authentication, async (req, res) => {

    //validate details before creating a mentor object
    const { error } = gradeSubmissionValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {

        //check if submission exists in database
        const castedID = mongoose.Types.ObjectId(req.body.submissionID);
        const submissionExists = await Submission.findById({ _id: castedID });
        if (!submissionExists) return res.status(400).send('This submission does not exist');

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
router.get('/admin/view-submissions/:assessID', authentication, async (req, res) => {

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
router.get('/admin/select-submission/:id', authentication, async (req, res) => {

    try {
        //check if submission is available in database and then display it
        const submissionExists = await Submission.findById(req.params.id);
        if (!submissionExists) return res.status(400).send('This submission does not exist.');
        res.send({ selectedSubmission: submissionExists })

    } catch (error) {
        res.send(error);

    }
});

//CREATE NEW USER
router.post('/admin/register', authentication, async (req, res) => {

    //validate details before creating an  object
    const { error } = userRegValidation(req.body);
    console.log(error);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email entered already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send({ failure: 'Email already exists!' });

    //Hash password entered
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new admin object
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role,
        roleName: req.body.roleName
    });

    //save admin to mongo db
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    }

    catch (error) {
        res.status(400).send(error);
    }

});

//EDIT USER
router.put('/admin/edit-user/:id', authentication, async (req, res) => {

    try {
        //check if user exists in database
        // const castedID = mongoose.Types.ObjectId(req.params.id);
        const userExists = await User.findById(req.params.id);

        if (!userExists) return res.status(400).send({ failure: 'This user does not exist!' });

        //check if details to update were sent
        if (Object.keys(req.body).length === 0) return res.status(400).send({ failure: "Enter a field you want to update!" })

        const editUser = await User.findByIdAndUpdate(req.params.id, req.body);

        if (editUser) {
            const updateTime = await User.findByIdAndUpdate(req.params.id, { updatedAt: Date.now() });
            if (updateTime) res.status(400).send({ success: "You successfully updated this user!" })
        }

    }


    catch (error) {

    }
});

//DELETE USER
router.delete('/admin/delete-user/:id', authentication, async (req, res) => {

    try {

        //check if user exists in database
        const userExists = await User.findById(req.params.id);
        if (!userExists) return res.status(400).send({ failure: 'This user does not exist' });

        //Delete user
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) res.status(200).send({ success: "You successfully deleted this user!" })
    }

    catch (error) {

        res.status(400).send(error);

    }

});

module.exports = router;