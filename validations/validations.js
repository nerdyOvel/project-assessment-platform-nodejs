const joi = require('@hapi/joi');

//Registration Validation
const regValidation = data => {
    const schema = joi.object({
        firstname: joi.string()
            .min(2)
            .max(255)
            .required(),
        lastname: joi.string()
            .min(2)
            .max(255)
            .required(),
        email: joi.string()
            .min(6)
            .max(255)
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//Registration Validation
const userRegValidation = data => {
    const schema = joi.object({
        firstname: joi.string()
            .min(2)
            .max(255)
            .required(),
        lastname: joi.string()
            .min(2)
            .max(255)
            .required(),
        email: joi.string()
            .min(6)
            .max(255)
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .max(1024)
            .required(),
        role: joi.number()
            .min(1)
            .max(255)
            .required(),
        roleName: joi.string()
            .min(3)
            .max(1024)
            .required()

    });

    return schema.validate(data);
}

//Admin new user
const adminNewUser = data => {
    const schema = joi.object({
        firstname: joi.string()
            .min(2)
            .max(255)
            .required(),
        lastname: joi.string()
            .min(2)
            .max(255)
            .required(),
        email: joi.string()
            .min(6)
            .max(255)
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .max(1024)
            .required(),
        role: joi.string()
            .min(1)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//Login Validation
const loginValidation = data => {
    const schema = joi.object({
        email: joi.string()
            .min(6)
            .max(255)
            .email()
            .required(),
        password: joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//Assessment Submission Validation
const submissionValidation = data => {
    const schema = joi.object({
        link: joi.string()
            .min(6)
            .max(1024)
            .required(),

        studentID: joi.string()
            .min(6)
            .max(1024)
            .required(),

        assessmentID: joi.string()
            .min(6)
            .max(1024)
            .required(),
        mentorID: joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}


//Assessment Submission Validation
const gradeSubmissionValidation = data => {
    const schema = joi.object({
        submissionID: joi.string()
            .min(6)
            .max(1024)
            .required(),

        gradeMark: joi.string()
            .min(2)
            .max(1024)
            .required(),

        mentorsRemarks: joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//View Submissions Validation
const ViewSubmissionsValidation = data => {
    const schema = joi.object({
        id: joi.string()
            .min(6)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//New Assessment Validation
const assessmentValidation = data => {
    const schema = joi.object({
        title: joi.string()
            .min(6)
            .max(1024)
            .required(),
        description: joi.string()
            .min(6)
            .max(1024)
            .required(),
        mentorID: joi.string()
            .min(12)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

//Edit Assessment Validation
const editAssessmentValidation = data => {
    const schema = joi.object({
        title: joi.string()
            .min(6)
            .max(1024)
            .required(),
        description: joi.string()
            .min(6)
            .max(1024)
            .required(),
        mentorID: joi.string()
            .min(12)
            .max(1024)
            .required()
    });

    return schema.validate(data);
}

module.exports.regValidation = regValidation;
module.exports.loginValidation = loginValidation;
module.exports.assessmentValidation = assessmentValidation;
module.exports.submissionValidation = submissionValidation;
module.exports.gradeSubmissionValidation = gradeSubmissionValidation;
module.exports.userRegValidation = userRegValidation;