const model = require('../models/model');

exports.validateMiddleware = (req, res, next) => {
    if (req.files == null || req.body.title == null || req.body.title == null) {
        return res.redirect('/posts/new')
    }
    next()
}

exports.authMiddleware = (req, res, next) => {
    model.User.findById(req.session.userId, (error, user) => {
        if (error || !user) {
            console.log('auth encounted error...')
            return res.redirect('/auth/login');
        }


        next()
    })
}

exports.redirectIfAuthenticatedMiddleware = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/');
    }
    next();
}