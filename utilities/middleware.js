const passport = require('passport')
const Author = require('../models/author')

const initializeHandler = async (req, res, next) => {
  const admin = await Author.findOne({ isAdmin: true })
  if (!admin) {
    res.redirect('/initialize')
    return
  }
  next()
}

const loginHandler = (req, res, next) => {
  passport.authenticate('jwt', (error, user, info) => {
    console.log(user)
    if (!user) {
      res.status(401).json({
        error: "Access Unauthorized"
      })
    }

    req.user = user
    next()
  })(req, res);
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
}

module.exports = { errorHandler, initializeHandler, loginHandler }