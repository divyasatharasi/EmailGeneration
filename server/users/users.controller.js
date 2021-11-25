const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
const userService = require('./user.service');
const config = require("../config.json")
const authJwt = require("../helper/authJwt")

router.get('/hello', function register(req, res, next) {
    console.log("hello")
    res.send({data: "hello"});
});

// Retrieve all users 
router.get('/users', function (req, res, next) {
    userService.getUsers()
    .then((data) => {
        res.json({message: "user list"});
    })
    .catch((err) => {
        console.error(`Error while getting users list `, err.message);
        next(err);
    })
});

router.post('/register', [authJwt.verifyToken], function register(req, res, next) {
    userService.create(req.body)
    .then((register_res) => {
        res.json({ message: 'Registration successful' })
    })
    .catch((err) => {
        console.log('register error :', err)
    });
});

router.post('/login', function login(req, res, next) {
	const username = req.body.email;
	const password = req.body.password;
	if (username && password) {
        userService.login(username, password)
        .then((login_res) => {
            if (login_res && !login_res.error && login_res.message == "success") {
                const user = login_res.user[0]
                req.session.user = user;
                const token = jwt.sign({ email: user.email }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    user,
                    accessToken: token
                });
            } else {
                res.json(login_res.message)
            }
        })
        .catch((err) => {
            console.log('login error :', err)
        });
        
	} else {
		response.send('Please enter Username and Password!');
	}
});

router.post('/resetPassword', function resetPassword(req, res, next) {
	const username = req.body.email;
	if (username) {
        userService.resetPassword(username)
        .then((service_res) => {
            if(service_res.error) {
                res.json(service_res.message)
            }
            else {
                res.json(service_res)
            }
        })
        .catch((err) => {
            console.log('resetPassword error :', err)
        });
        
	} else {
		response.send('Please enter a valid email!');
	}
});

router.post('/updatePassword', [authJwt.verifyToken], function updatePassword(req, res, next) {
	const username = req.body.email;
	const currentPassword = req.body.currentPassword;
	const newPassword = req.body.newPassword;
	if (username && currentPassword && newPassword) {
        userService.updatePassword(username, currentPassword, newPassword)
        .then((service_res) => {
            if(service_res.error) {
                res.json(service_res.message)
            }
            else {
                res.json(service_res)
            }
        })
        .catch((err) => {
            console.log('updatePassword error :', err)
        });
	} else {
		res.send('All fields are mandatory!');
	}
});

router.get('/home', [authJwt.verifyToken], function(request, response) {
    console.log("home get route : ", request.user, request.session)
	if (request.user) {
		response.send('Welcome back, ' + request.user + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

router.get('/logout', [authJwt.verifyToken],(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;