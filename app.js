var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
require('express-async-errors');

// utilities
const { MONGODB_URI } = require('./utilities/config');
const { errorHandler } = require('./utilities/middleware');

// route imports
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authorRouter');
const blogRouter = require('./routes/blogRouter');
const topicRouter = require('./routes/topicRouter');

var app = express();

// Mongoose connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error:"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('build'))

// routes
app.use(indexRouter);
app.use('/api/authors', authorRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/topics', topicRouter);
app.get('*', (function(req, res) {
  res.sendFile('index.html', {root: path.join(__dirname, './build/')});
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
