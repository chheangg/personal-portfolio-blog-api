const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport')
require('./utilities/passport')
require('express-async-errors');

// utilities
const { MONGODB_URI } = require('./utilities/config');
const { errorHandler, initializeHandler } = require('./utilities/middleware');

// route imports
const auth = require('./routes/auth')
const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authorRouter');
const blogRouter = require('./routes/blogRouter');
const topicRouter = require('./routes/topicRouter');

const app = express();

// Mongoose connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, "MongoDB connection error:"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));

// routes
app.use('/auth', auth)
app.use(indexRouter);
app.use('/api/authors', authorRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/topics', topicRouter);

app.use('/admin', initializeHandler, express.static(path.join(__dirname, 'admin')));

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/admin/index.html'));
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorHandler);

module.exports = app;
