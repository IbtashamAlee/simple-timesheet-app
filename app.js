var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let mongoose = require("mongoose");
require('dotenv').config();
var passport = require("passport");

const db = process.env.TEST_DB || "mongodb://localhost:27017/timesheetdb";
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database is connected");
}).catch(err => {
    console.log("Error is ", err.message);
});


var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "client-app/build")));
    app.use(express.static("public"));
} else {
    app.use(express.static(path.join(__dirname, 'public')));
}

//Passport middleware
app.use(passport.initialize());

//Config for JWT strategy
require("./stratgies/jwt-strategy")(passport);


app.use('/users', usersRouter);
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, ".", "client-app/build", "index.html"));
});

module.exports = app;
