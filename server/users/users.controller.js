const express = require('express');
const router = express.Router();
var jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path')
const userService = require('./user.service');
const config = require("../config.json")
const authJwt = require("../helper/authJwt");

//! Use of Multer
var storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './uploads/')     // './uploads/' directory name where save the file
    },
    filename: (req, file, callBack) => {
        callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
});

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
        res.status(500).send(err);
        next(err);
    })
});

router.post('/register', [authJwt.verifyToken], function register(req, res, next) {
    userService.create(req.body)
    .then((register_res) => {
        res.json(register_res)
    })
    .catch((err) => {
        console.log('register error :', err)
        res.status(500).send(err);
    });
});

router.post('/login', function login(req, res, next) {
	const username = req.body.email;
	const password = req.body.password;
	if (username && password) {
        userService.login(username, password)
        .then((login_res) => {
            console.log("login_res: ", login_res)
            if (login_res && !login_res.error && login_res.message == "success") {
                const user = login_res.user[0]
                req.session.user = user;
                const token = jwt.sign({ email: user.email }, config.secret, {
                    expiresIn: 86400 // 24 hours
                });
                res.status(200).send({
                    user,
                    accessToken: token,
                    redirect: login_res.redirect || ''
                });
            } else {
                res.json(login_res)
            }
        })
        .catch((err) => {
            console.log('login error :', err)
            res.status(500).send(err);
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
            res.json(service_res)
        })
        .catch((err) => {
            console.log('resetPassword error :', err)
            res.status(500).send(err);
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
            console.log('service_res :', service_res)
            res.json(service_res)
        })
        .catch((err) => {
            console.log('updatePassword error :', err)
            res.status(500).send(err);
        });
	} else {
		res.send('All fields are mandatory!');
	}
});

router.post('/fileUpload', [authJwt.verifyToken], upload.single('file'), function(request, response) {
    debugger;
    console.log("fileUpload route : ", request.file, request.body.fileContentType)
	if (request.file) {
        
        const fileContentType = request.body.fileContentType
        userService.fileUpload(request.file, fileContentType, request, response)
        .then((upload_res) => {
            console.log("upload_res: ", upload_res)
            if (upload_res && !upload_res.error) {
                response.status(200).send(upload_res);
            } else {
                response.send(upload_res)
            }
        })
        .catch((err) => {
            console.log('login error :', err)
            response.status(500).send(err);
        });
	} else {
		response.send('Please login to view this page!');
	}
});

// Retrieve all users 
router.get('/customerList', function (req, res, next) {
    userService.getCustomerList()
    .then((response) => {
        res.json({message: "user list", data: response});
    })
    .catch((err) => {
        console.error(`Error while getting users list `, err.message);
        res.status(500).send(err);
        next(err);
    })
});

// Retrieve filtered users created between from date and to date
router.post('/getFilteredCustomerList', function (req, res, next) {
    const { from_date, to_date } = req.body;
    userService.getCustomerList(from_date, to_date)
    .then((response) => {
        res.json({message: "Filtered user list", data: response});
    })
    .catch((err) => {
        console.error(`Error while getting users list `, err.message);
        res.status(500).send(err);
        next(err);
    })
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