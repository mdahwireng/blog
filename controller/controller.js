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
        var title = ""
        var body = ""
        const flashContent = req.flash()
        const data = flashContent.data

        if (typeof data != 'undefined') {
            title = data[0].title
            body = data[0].body
        }
        res.render('create', {
            errors: flashContent.validationErrors,
            title: title,
            body: body
        });
    }
    //res.redirect('/auth/login');
}

exports.storePost = (req, res) => {
    const errors = []
    var imageDir = ""
    if (req.files != null) {
        var image = req.files.image;
        var imageDir = '/img/' + image.name
        if (req.files != null && req.body.title != "" && req.body != "") {
            image.mv(path.resolve(__dirname, '..', 'public/img', image.name), (error) => {
                if (error) {
                    errors.push(...error);
                }
            });
        }
    }

    model.BlogPost.create({
            ...req.body,
            image: imageDir
        },
        (error, blogpost) => {
            if (error) {
                const validationErrors = Object.keys(error.errors).map(i => error.errors[i].message);
                errors.push(...validationErrors);
                req.flash('validationErrors', errors);
                if (req.body != '') {
                    req.flash('data', req.body);
                }
                return res.redirect('/posts/new');

            }
            res.redirect('/')
        }
    )

}

exports.newUser = (req, res) => {
    var username = ""
    var password = ""
    const flashContent = req.flash()
    const data = flashContent.data

    if (typeof data != 'undefined') {
        username = data[0].username
        password = data[0].password
    }

    res.render('register', {
        errors: flashContent.validationErrors,
        username: username,
        password: password
    });
}

exports.storeUser = async(req, res) => {
    await model.User.create(req.body, (error, user) => {
        if (error) {
            const validationErrors = Object.keys(error.errors).map(i => error.errors[i].message);
            req.flash('validationErrors', validationErrors);
            if (req.body != '') {
                req.flash('data', req.body);
            }
            return res.redirect('/auth/register');
        }
        res.redirect('/');
    })
}

exports.login = (req, res) => {
    errors = []
    username = ''
    password = ''

    const flashContent = req.flash()
    if (flashContent != null) {
        errors = flashContent.validationErrors
        username = flashContent.data[0].username
        password = flashContent.data[0].password
    }

    res.render("login", {
        errors: errors,
        username: username,
        password: password
    });
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

exports.loginUser = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const errors = []

    model.User.findOne({ username: username }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (error, same) => {
                if (same) {
                    req.session.userId = user._id;
                    res.redirect('/');
                } else {
                    errors.push('Password incorrect')
                    req.flash('validationErrors', errors);
                    req.flash('data', req.body);
                    res.redirect('/auth/login');
                }
            })
        } else {
            errors.push('Username not found')
            req.flash('validationErrors', errors);
            req.flash('data', req.body);
            res.redirect('/auth/login');
        }
    })
}