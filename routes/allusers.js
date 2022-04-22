const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { userRegValidation, loginValidation } = require('../validations/validations');
const bcrypt = require('bcrypt');

//LOGIN ENDPOINT
router.post('/login', async (req, res) => {

    //validate details before creating a user object
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email is a valid email in database
    const userExists = await User.findOne({ email: req.body.email });
    if (!userExists) return res.status(400).send({ failure: 'Email or password is incorrect' });

    //check if password is correct against email
    const validPassword = await bcrypt.compare(req.body.password, userExists.password);
    if (!validPassword) return res.status(400).send({ failure: 'Email or password is incorrect' });

    const verificationToken = jwt.sign({ _id: userExists._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', verificationToken);

    //Output user details
    res.send({ message: "Login Successful", firstname: userExists.firstname, lastname: userExists.lastname, email: userExists.email, Role: userExists.roleName, createdAt: userExists.createdAt, updatedAt: userExists.updatedAt });


});

//REGISTER ENDPOINT
router.post('/register', async (req, res) => {

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

module.exports = router;
