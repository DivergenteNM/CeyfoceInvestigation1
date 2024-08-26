var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const database = require('./databaseConection');

var indexRouter = require('./routes/index');
var accountRouter = require('./routes/account');
var platformRouter = require('./routes/platform');
var usersRouter = require('./routes/users');
const resultsRouter = require('./routes/results');
const institutions = require('./routes/institutions');
const students = require('./routes/students');
// const verifyToken = require('./token/verifyToken');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: '*'
}));
// app.use(function(req, res, next) {
//   // res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Origin', 'https://ceyfoce.tk');
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-COntrol-Allow-Request-Method, x-access-token');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//   next();
// });

app.use('/', indexRouter);
app.use('/account', accountRouter);
app.use('/platform', platformRouter);
app.use('/results', resultsRouter);
app.use('/users', usersRouter);
app.use('/institutions', institutions);
app.use('/student', students);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({"error":res.locals.error});
});

module.exports = app;
