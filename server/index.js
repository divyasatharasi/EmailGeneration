const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const cors = require("cors");
const userRouter = require('./users/users.controller')

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Email Id Generation Portal." });
});

app.post("/sample", (req, res) => {
  res.json({message: "hello"})
})
app.use('/user', userRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});