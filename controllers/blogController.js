const { body, validationResult } = require('express-validator')

const Blog = require('../models/blog')
const Author = require('../models/author')

exports.BLOG_LIST = async (req, res) => {
  const blogs = await Blog.find({})
    .populate('comments')
  
  console.log(blogs[0].id)
  res.json({
    blogs
  })
}

exports.BLOG_CREATE = [
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
  body('section.*')
    .trim()
    .escape(),
  async (req, res) => {
    const body = req.body
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


    const blog = new Blog({
      title: body.title,
      caption: body.caption,
      author: author,
      timestamp: Date.now(),
      sections: body.sections,
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