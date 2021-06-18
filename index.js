const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const expressSession = require('express-session');
const flash = require('connect-flash');
const router = require('./route/router');
const dotenv = require('dotenv');
const connectDB = require('./database/connection')

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;
// database connection
connectDB();
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

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});

app.use('/', router);