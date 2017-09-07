var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var session = require('express-session');
var flash = require('connect-flash');

var login = require('./routes/api/login')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport
app.use(session({ 
  secret: 'your secret key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/login', login);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

// user data
var Users = {
  test1:{
    name: 'test1',
    password: 'password1'
  },
  test2:{
    name: 'test2',
    password: 'password2'
  }
};

// local strategy
passport.use('local', new localStrategy({
    // usernameField: 'inputEmail',
    // passwordField: 'inputPassword',
    passReqToCallback: true
  },
  function(req, username, password, done){    
    user = Users[username];

    if (user ==  null) {
      return done(null, false, { message: 'Invalid user' });
    };

    if (user.password !== password){
      return done(null, false, { message: 'Invalid user' });
    }
    
    return done(null, user);
  }
));

passport.serializeUser(function(user, done){
  return done(null, user.name);
});

passport.deserializeUser(function(user, done){
  return done(null, Users[user.name]);
});

module.exports = app;
