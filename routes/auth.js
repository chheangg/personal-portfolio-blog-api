const express = require('express');
const router = express.Router();
const passport = require("passport");
const { JWT_SECRET } = require('../utilities/config')
const jwt = require('jsonwebtoken');

router.post(
  '/login', 
  async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, author, info) => {
      if (!author) {
        res.status(400).json(info)
        return
      }

      const tokenObject = {
        username: author.username,
        id: author._id
      }

      const sanitizedAuthor = {
        ...tokenObject,
        isAdmin: author.isAdmin,
        blogs: author.blogs,
      }

      req.login(sanitizedAuthor, { session: false }, (err) => {
        const token = jwt.sign(tokenObject, JWT_SECRET)
        res.json({ user: sanitizedAuthor, token })
      })

    })(req, res)
  }
)

module.exports = router