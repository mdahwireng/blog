const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const controller = require('./controller/controller');
const middleware = require('./middleware/middleware');
const expressSession = require('express-session');

mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true });
app = new express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession({
    secret: 'keyboard cat'
}));
app.use(express.static('public'));
app.use(fileUpload());
//app.use('/posts/store', middleware.validateMiddleware);
app.set('view engine', 'ejs');

app.listen(4000, () => {
    console.log(`App is running on http://localhost:4000`);
});

app.get('/', controller.home);

app.get('/post/:id', controller.getPost);

app.get('/posts/new', middleware.authMiddleware, controller.newPost);

app.post('/posts/store', middleware.validateMiddleware, middleware.authMiddleware, controller.storePost);

app.get('/auth/register', controller.newUser);

app.post('/users/register', controller.storeUser);

app.get('/auth/login', controller.login);

app.post('/users/login', controller.loginUser);