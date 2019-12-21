var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');
var authRouter = require('./routes/auth');

const passport = require('passport');

const mysql = require('mysql');
const connection = mysql.createConnection({
  "host": "13.125.241.39",
  "user": "root",
  "password": "u*fcqUJ<6Ju\"v`*U",
  "database": "mmstory"
});

global.db = connection;

require('./passport');

var app = express();

app.use(logger('dev'));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(cors())
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads/profile')));
app.use(express.static(path.join(__dirname, 'uploads/img')));
app.set('view engine', 'jade');
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', passport.authenticate('jwt', {
  session: false
}), usersRouter);
app.use('/board', passport.authenticate('jwt', {
  session: false
}), boardRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  let result = {
    status: false,
    message: err.message
  };
  res.status(500).json(result);
});

module.exports = app;