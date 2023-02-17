const { body, validationResult } = require('express-validator')

const Blog = require('../models/blog')
const Author = require('../models/author')
const Topic = require('../models/topic')
const Comment = require('../models/comment')

// Display a list of blogs
exports.BLOG_LIST = async (req, res) => {
  const blogs = await Blog.find({}, { sections: 0 })
    .populate('topics', { blogs: 0})
    .populate('author', { blogs: 0, username: 0, passwordHash: 0 })
  
  res.json({
    blogs
  })
}

// Handle blog creation functionalities
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


    // Save blog to each topic document
    const savedTopics = topics.map(topic => {
      topic.blogs.push(blog._id)
      return topic
    })

    console.log(blog)

    await blog.save()
    await savedTopics.forEach(async (topic) => await topic.save())

    res.json({
      blog
    })    
  }
]


// Display blog's detail
exports.BLOG_DETAIL = async (req, res) => {
  const blog = await Blog.findById(req.params.blogId)
    .populate('topics', { blogs: 0})
    .populate('comments', { blog: 0 })
    .populate('author', { blogs: 0, username: 0, passwordHash: 0 })
    
  if (!blog) {
    res.status(404).json({ error: `Blog ${req.params.blogId} not found` })
  }
  res.json({
    blog
  })
}


// Handle blog editing functionalities
exports.BLOG_EDIT = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_EDIT ${req.params.blogId}`)
}


// Handle blog deletion functionalities
exports.BLOG_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_DELETE ${req.params.blogId}`)
}


// Display a list of comment of a blog
exports.COMMENT_LIST = async (req, res) => {
  const blog = await Blog.findById(req.params.blogId)

  if (!blog) {
    res.status(404).json({ error: `Blog ${req.params.blogId} not found` })
  }

  res.json({
    comments: blog.comments
  })
}

// Handle comment creation on a blog functionalities
exports.COMMENT_CREATE = [
  body('author')
    .trim()
    .escape(),
  body('content')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('Comment must be at least 3 characters long')
    .isLength({ max: 256 }).withMessage('Comment must not be longer than 256 characters long'),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body

    // Check if blog and author exists
    console.log(req.params.blogId, body.author)

    const blog = await Blog.findById(req.params.blogId)
    const author = await Author.findById(body.author)
    

    if (!blog && !author) {
      res.status(400).json({
        error: 'Either blog or author doesn\'t exist'
      })
    }

    const comment = new Comment({
      blog: blog._id,
      author: author._id,
      content: body.content,
      timestamp: Date.now(),
    })

    blog.comments.push(comment)

    await comment.save()
    await blog.save()

    res.json({
      comment
    })
  }
]

// Display a list of reply of a comment
exports.REPLY_LIST = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_LIST ${req.params.blogId} / ${req.params.commentId}`)
}

// Handle reply creation on a comment functionalities
exports.REPLY_CREATE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_CREATE ${req.params.blogId} / ${req.params.commentId}`)
}