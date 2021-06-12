const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const BlogPostSchema = new Schema({
    title: String,
    body: String,
    username: String,
    datePosted: { /* can declare property type with an object like this because we need 'default' */
        type: Date,
        default: new Date()
    },
    image: String
});

exports.BlogPost = mongoose.model('BlogPost', BlogPostSchema);

UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please provide username.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password.']
    }
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10, (error, hash) => {
        this.password = hash;
        next();
    });
});

exports.User = mongoose.model('User', UserSchema);