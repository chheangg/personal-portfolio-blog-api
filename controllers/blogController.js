const { body, validationResult } = require('express-validator')
const { parse, valid } = require('node-html-parser')
const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + '-' + file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    cb(new Error('Only images are allowed'))
  }

  cb(null, true)
}

const upload = multer({
  storage,
  fileFilter: fileFilter,
  limits: {
    fieldNameSize: 999999999,
    fieldSize: 999999999
  },
});

const Blog = require('../models/blog')
const Author = require('../models/author')
const Topic = require('../models/topic')
const Comment = require('../models/comment')
const Reply = require('../models/reply')

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
  upload.single('thumbnail'),
  (req, res, next) => {
    req.body.topics = req.body.topics ? [...req.body.topics.split(',')] : []
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
    .isLength({ min: 5 }).withMessage('Caption must be at least 5 characters long')
    .isLength({ max: 256 }).withMessage('Caption must not be longer than 256 characters long'),
  body('author')
    .escape(),
  body('topics.*')
    .trim()
    .escape(),
  body('content')
    .trim(),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      console.log(req.file)
      await unlinkAsync(req.file.path)
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
            errors: [
              {
                param: 'user',
                msg: "User not found"
              }
            ]
          }
        )
      return
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
          errors: [
            {
              param: 'topic',
              msg: "Some topic are invalid"
            }
          ]
        })
      return;
    }

    // Parse HTML and check if it is valid
    const parsedContent = parse(body.content)

    if (!valid(parsedContent)) {
      res
        .status(400)
        .json(
          {
            errors: [
              {
                param: 'content',
                msg: "Content not valid"
              }
            ]
          }
        )
        return
    }

    const sanitizedContent = sanitizeHtml(body.content)
    const blog = new Blog({
      title: body.title,
      caption: body.caption,
      author: author._id,
      timestamp: Date.now(),
      content: sanitizedContent,
      topics: body.topics ? body.topics : [],
      thumbnail: req.file ? req.file.path : ''
    })

    // Save blog to each topic document
    const savedTopics = topics.map(topic => {
      topic.blogs.push(blog._id)
      return topic
    })


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
  const comments = await Comment.find({ blog: req.params.blogId })
    .populate('author')

  if (!comments) {
    res.status(404).json({ error: `Blog ${req.params.blogId} not found` })
  }

  res.json({
    comments
  })
}

// Handle comment creation on a blog functionalities
exports.COMMENT_CREATE = [
  body('author')
    .trim()
    .escape(),
  body('name')
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

    const blog = await Blog.findById(req.params.blogId)

    let author
    if (body.author) {
      author = await Author.findById(body.author)
    }
    
    if (!blog || (body.author && !author)) {
      res.status(400).json({
        error: 'Either blog or author doesn\'t exist'
      })
    }

    let comment
    if (body.author) {
      comment = new Comment({
        blog: blog._id,
        author: author,
        content: body.content,
        timestamp: Date.now(),
      })
    } else {
      comment = new Comment({
        blog: blog._id,
        name: body.name,
        content: body.content,
        timestamp: Date.now(),
      })
    }

    blog.comments.push(comment)

    await comment.save()
    await blog.save()

    res.json({
      comment
    })
  }
]

// Display a list of reply of a comment
exports.REPLY_LIST = async (req, res) => {
  const replies = await Reply.find({
    comment: req.params.commentId
  }).populate('author')


  if (!replies) {
    res.status(404).json({ error: `Blog ${req.params.blogId} not found` })
  }

  res.json({
    replies
  })
  
}

// Handle reply creation on a comment functionalities
exports.REPLY_CREATE = [
  body('author')
    .trim()
    .escape(),
  body('name')
    .trim()
    .escape(),
  body('content')
    .trim()
    .escape()
    .isLength({ min: 3 }).withMessage('Reply must be at least 3 characters long')
    .isLength({ max: 256 }).withMessage('Reply must not be longer than 256 characters long'),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body

    const comment = await Comment.findById(req.params.commentId)

    let author
    if (body.author) {
      author = await Author.findById(body.author)
    }
    
    if (!comment || (body.author && !author)) {
      res.status(400).json({
        error: 'Either blog or author doesn\'t exist'
      })
    }

    let reply
    if (body.author) {
      reply = new Reply({
        comment: comment._id,
        author: author,
        content: body.content,
        timestamp: Date.now(),
      })
    } else {
      reply = new Reply({
        comment: comment._id,
        name: body.name,
        content: body.content,
        timestamp: Date.now(),
      })
    }

    comment.replies.push(comment)

    await reply.save()
    await comment.save()

    res.json({
      reply
    })
  }
]