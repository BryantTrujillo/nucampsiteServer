var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser'); <-- no longer used
var logger = require('morgan');
// const session = require('express-session'); <-- no longer used, replaced by JWT
// const FileStore = require('session-file-store')(session); <-- no longer used, replaced by JWT
const passport = require('passport');
// const authenticate = require('./authenticate'); <-- no longer used, handled by ./config.js
const config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log('Connected correctly to server'),
  (err) => console.log(err)
);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321')); <-- no longer used

// app.use( <-- no longer used, handled by JWT
//   session({
//     name: 'session-id',
//     secret: '12345-67890-09876-54321',
//     saveUninitialized: false,
//     resave: false,
//     store: new FileStore(),
//   })
// );

app.use(passport.initialize());
// app.use(passport.session()); <-- no longer used, handled by JWT

app.use('/', indexRouter);
app.use('/users', usersRouter);

// function auth(req, res, next) { <-- no longer used, handled by JWT
//   console.log(req.user);
//   // console.log(req.headers); <-- for testing
//   if (!req.user) {
//     // const authHeader = req.headers.authorization; <-- no longer used
//     // console.log(req.headers.authorization); <-- for testing
//     // if (!authHeader) { <-- no longer used
//     const err = new Error('You are not authenticated!');
//     // res.setHeader('WWW-Authenticate', 'Basic'); <-- no longer used, handled in ./routes/user.js
//     err.status = 401;
//     return next(err);
//     // const auth = Buffer.from(authHeader.split(' ')[1], 'base64') <-- no longer used, handled in ./routes/user.js
//     //   .toString()
//     //   .split(':');
//     // const user = auth[0];
//     // const pass = auth[1];
//     // if (user === 'admin' && pass === 'password') {
//     //   req.session.user = 'admin';
//     //   // res.cookie('user', 'admin', { signed: true }); <-- no longer used
//     //   return next();
//     // } else {
//     //   const err = new Error('You are not authenticated!');
//     //   res.setHeader('WWW-Authenticated', 'Basic');
//     //   err.status = 401;
//     //   return next(err);
//     // }
//   } else {
//     // if (req.session.user === 'authenticated') { <-- no longer used, handled by Passport
//     //   return next();
//     // } else {
//     //   const err = new Error('You are not authenticated!');
//     //   err.status = 401;
//     return next();
//   }
// }

// app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);

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
  // res.status(err.status || 500) is not a function error in console logs --> changed to res.status = err.status || 500 --> default install from Express Generator produced error
  res.status = err.status || 500;
  res.render('error');
});

module.exports = app;
