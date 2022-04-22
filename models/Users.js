const mongoose = require('mongoose');


//admin schema
const userSchema = mongoose.Schema(
    {
        firstname:
        {
            type: String,
            required: true,
            min: 2,
            max: 255
        },

        lastname:
        {
            type: String,
            required: true,
            min: 2,
            max: 255
        },

        email:
        {
            type: String,
            required: true,
            min: 6,
            max: 255
        },

        password:
        {
            type: String,
            required: true,
            min: 6,
            max: 1024
        },

        role:
        {
            type: Number,
            required: true,
            min: 1,
            max: 3
        },


        roleName:
        {
            type: String,
            required: true,
            min: 3,
            max: 7
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
        }
    });

module.exports = mongoose.model('User', userSchema);