const express = require('express');
const controller = require("../controller/controller");
const middleware = require("../middleware/middleware");

const route = express.Router();

route.get('/', controller.home);

route.get('/post/:id', controller.getPost);

route.get('/posts/new', middleware.authMiddleware, controller.newPost);

route.post('/posts/store', middleware.authMiddleware, controller.storePost);

route.get('/auth/register', middleware.redirectIfAuthenticatedMiddleware, controller.newUser);

route.post('/users/register', middleware.redirectIfAuthenticatedMiddleware, controller.storeUser);

route.get('/auth/login', middleware.redirectIfAuthenticatedMiddleware, controller.login);

route.get('/auth/logout', controller.logout);

route.post('/users/login', middleware.redirectIfAuthenticatedMiddleware, controller.loginUser);

route.use((req, res) => {
    res.render('notfound');
});


module.exports = route;