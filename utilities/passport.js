const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { JWT_SECRET } = require('../utilities/config');
const Author = require('../models/author')

/// Methods
passport.use(new LocalStrategy({}, async (username, password, cb) => {
  const author = await Author.findOne({ username }).select('+passwordHash')
  if (!author) {
    return cb(null, false, { message: "Username doesn't exist" })
  }
  const passwordCorrect = await bcrypt.compare(password, author.passwordHash)
  if (!passwordCorrect) {
    return cb(null, false, { message: "Password is incorrect" })
  }
  
  return cb(null, author, { message: "Logged in successfully" })
}))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, cb) => {
  const author = await Author.findById(payload.id)
  if (!author) {
    return cb(null, false)
  }
 return cb(null, author)
}
))