const model = require("../models/model");
const path = require('path');
const bcrypt = require('bcrypt');

exports.home = async(req, res) => {
    const blogposts = await model.BlogPost.find({});
    res.render('index', { blogposts });
}

exports.getPost = async(req, res) => {
    blogpost = await model.BlogPost.findById(req.params.id);
    res.render('post', { blogpost });
}

exports.newPost = (req, res) => {
    if (req.session.userId) {
        res.render('create');
    }
    //res.redirect('/auth/login');
}

exports.storePost = (req, res) => {
    let image = req.files.image
    image.mv(path.resolve(__dirname, '..', 'public/img', image.name), async(error) => {
        await model.BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/')
    });
}

exports.newUser = (req, res) => {
    res.render('register', {
        errors: req.flash().validationErrors
    });
}

exports.storeUser = async(req, res) => {
    await model.User.create(req.body, (error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(i => error.errors[i].message);
            req.flash('validationErrors', validationErrors);
            return res.redirect('/auth/register');
        }
        res.redirect('/');
    })
}

exports.login = (req, res) => {
    res.render("login");
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.loginUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    model.User.findOne({ username: username }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id;
                    res.redirect('/');
                } else {
                    res.redirect('/auth/login');
                }
            })
        } else {
            res.redirect('auth/login');
        }
    })
}