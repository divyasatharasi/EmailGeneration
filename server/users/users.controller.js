const express = require('express');
const router = express.Router();
const userService = require('./user.service');

router.get('/hello', function register(req, res, next) {
    console.log("hello")
    res.send({data: "hello"});
});

// Retrieve all users 
router.get('/users', function (req, res, next) {
    userService.getUsers()
    .then((data) => {
        console.log("data : ", data);
        res.json({message: "user list"});
    })
    .catch((err) => {
        console.error(`Error while getting users list `, err.message);
        next(err);
    })
});

router.post('/register', function register(req, res, next) {
    console.log("register", req.body)
    userService.create(req.body)
    .then(() => res.json({ message: 'Registration successful' }))
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
            if(login_res.error) {
                res.json(login_res.message)
            }
            else {
                console.log("login_res : ", login_res)
                res.json(login_res)
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
                console.log("resetPassword - service_res : ", service_res)
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

router.post('/updatePassword', function updatePassword(req, res, next) {
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
                console.log("service_res : ", service_res)
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

router.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

module.exports = router;