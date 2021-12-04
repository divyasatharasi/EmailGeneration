const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require('path');

const userRouter = require('./users/users.controller')

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(cookieParser());
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "user",
    secret: "email-generation",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24 * 1000,
    },
  })
);

app.use(express.json());

// // Have Node serve the files for our built React app
// app.use(express.static(path.resolve(__dirname, '../portal/build')));

app.use((req, res, next) => {
  console.log(req.session)
  next();
})

app.use('/api', userRouter);

// // All other GET requests not handled before will return our React app
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../portal/build', 'index.html'));
// });

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});