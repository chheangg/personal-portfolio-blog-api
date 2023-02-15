const { body, validationResult } = require('express-validator')

const Blog = require('../models/blog')
const Author = require('../models/author')
const Topic = require('../models/topic')

exports.BLOG_LIST = async (req, res) => {
  const blogs = await Blog.find({})
    .populate('topics', { blogs: 0 })
    .populate('author', { blogs: 0, username: 0, passwordHash: 0 })
  
  res.json({
    blogs
  })
}

exports.BLOG_CREATE = [
  (req, res, next) => {
    if (Array.isArray(req.body.topics)) {
      req.body.topics = typeof req.body.topics === undefined ? [] : [...req.body.topics]
    }

    next()
  },
  body('title')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
    .isLength({ max: 64 }).withMessage('Title must not be longer than 64 characters long'),
  body('caption')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
    .isLength({ max: 256 }).withMessage('Title must not be longer than 256 characters long'),
  body('author')
    .escape(),
  body('topics.*')
    .trim()
    .escape(),
  body('section.*')
    .trim()
    .escape(),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body

    // Check author's existence
    const author = await Author.findById(body.author)
    if (!author) {
      res
        .status(400)
        .json(
          {
            error: "User not found"
          }
        )
    }

    let validTopic = true;

    // Check topics' existence
    const allTopics = await Topic.find({})
    let topics = [];


    for(const blogTopic of body.topics) {
      const topic = allTopics.find(topic => topic._id.toString() === blogTopic)
      if (!allTopics.includes(blogTopic) && !topic) {
        validTopic = false;
      }

      topics.push(topic)
    }

    if (!validTopic) {
      res
        .status(400)
        .json({
          error: "Topic not found"
        })
      return;
    }

    const blog = new Blog({
      title: body.title,
      caption: body.caption,
      author: author._id,
      timestamp: Date.now(),
      sections: body.sections,
      topics: body.topics ? body.topics : []
    })

    await blog.save()

    res.json({
      blog
    })    
  }
]

exports.BLOG_DETAIL = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_DETAIL ${req.params.blogId}`)
}

exports.BLOG_EDIT = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_EDIT ${req.params.blogId}`)
}

exports.BLOG_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_DELETE ${req.params.blogId}`)
}

exports.COMMENT_LIST = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: COMMENT_LIST ${req.params.blogId}`)
}

exports.COMMENT_CREATE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: COMMENT_CREATE ${req.params.blogId}`)
}

exports.REPLY_LIST = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_LIST ${req.params.blogId} / ${req.params.commentId}`)
}

exports.REPLY_CREATE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_CREATE ${req.params.blogId} / ${req.params.commentId}`)
}