const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const initializerRouter = require('./initializeRouter')
const Author = require('../models/author')

// POST request for creating an Author
router.post('/sign-up', authorController.AUTHOR_CREATE);

// POST request for creating an Admin Author
router.use(
  '/initialize',
  async (req, res, next) => {
    const admin = await Author.findOne({ isAdmin: true })
    if (!admin) {
      next()
      return
    }
    res.redirect('/admin')
  },
  initializerRouter)

module.exports = router;