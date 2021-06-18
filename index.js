const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const router = require('./route/router');

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });
app = new express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({
    secret: 'oneWord'
}));
app.use(express.static('public'));
app.use(fileUpload());
app.use(flash());

global.loggedIn = null

app.use('*', (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});

//app.use('/posts/store', middleware.validateMiddleware);
app.set('view engine', 'ejs');

app.listen(4000, () => {
    console.log(`App is running on http://localhost:4000`);
});

app.use('/', router);