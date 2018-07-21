var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

//for file upload handling
var multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0])
  }
})
//using the session variable to track unique user sessions
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var upload = require('./routes/upload');
var calc = require('./routes/calc');
var socket_calc = require('./routes/socket-calc');
var app = express();

app.io = require('socket.io')({
  path: '/pycrossfilter'
});

var pycrossfilter = require('./routes/pycrossfilter')(app.io);

app.set('file_path','Hello World!');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//enable cors
app.use(cors({origin: '*'}));

// app.use(express.bodyParser());
// app.use(express.cookieParser());
// app.use(express.session({
//   key: 'mouse-dog-key',
//   secret: 'mouse dog',
//   store
// }));
app.use(session({
  secret: 'mouse dog',
  resave: true,
  saveUninitialized: true
}));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({dest: "./uploads/",storage: storage}).any());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/upload',upload);
app.use('/calc',calc);
app.use('/socket-calc',socket_calc);
app.use('/pycrossfilter',pycrossfilter);

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
  res.status(err.status || 500);
  res.render('error');
});


function genuuid(req){
  return req;
}


module.exports = app;