const Author = require('../models/author')
const bcrypt = require('bcrypt')
const { body, validationResult } = require('express-validator')

// Handle the creation of author
exports.AUTHOR_CREATE = [
  body('username')
    .trim()
    .escape()
    .isEmail().withMessage('username must be email')
    .normalizeEmail(),
  body('name')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('name must be at least 3 characters long')
    .isLength({ max: 16 }).withMessage('name must be at most 16 characters long'),
  body('password')
    .trim()
    .escape()
    .isLength({ min: 3, max: 256 }).withMessage('password must be at least 3 characters long'),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.body.password, saltRounds);

    const body = {
      username: req.body.username,
      name: req.body.name,
      passwordHash,
      blogs: req.body.blogs ? req.body.blogs : [],
    }
  
    const author = new Author(body)
    await author.save()
    res.json(author);
  } 
]