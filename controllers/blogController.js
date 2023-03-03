const { body, validationResult } = require('express-validator')
const { parse, valid } = require('node-html-parser')
const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('uuid');
const multer  = require('multer')
const path = require('path')
const fs = require('fs')
const { loginHandler } = require('../utilities/middleware')

const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
const existAsync = promisify(fs.exists)

const imageDir = './public/images'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageDir)
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + '-' + file.originalname.toLowerCase().split(' ').join('-');
    cb(null, fileName)
  }
})

const fileFilter = async (req, file, cb) => {
  const fileExists = await existAsync(imageDir + '/' + file.originalname.toLowerCase().split(' ').join('-'))

  if (fileExists) {
    return cb(null, false)
  }

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


// Upload image
exports.UPLOAD_IMAGE = [
  loginHandler,
  upload.single('image'),
  (req, res) => {
    res.json({
      path: '/' +   req.file.path
    })
  }
]

// Display a list of blogs
exports.BLOG_LIST = async (req, res) => {
  const blogs = await Blog.find({ isPublished: true }, { sections: 0 })
    .populate('topics', { blogs: 0})
    .populate('author', { blogs: 0, username: 0, passwordHash: 0 })
  
  res.json({
    blogs
  })
}

exports.BLOG_ADMIN_LIST = [
  loginHandler,
  async (req, res) => {
    const blogs = await Blog.find({}, { sections: 0 })
      .populate('topics', { blogs: 0})
      .populate('author', { blogs: 0, username: 0, passwordHash: 0 })
    
    res.json({
      blogs
    })
  }
]

// Handle blog creation functionalities
exports.BLOG_CREATE = [
  loginHandler,
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
      await unlinkAsync(req.file.path)
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body

    // Check author's existence
    const author = await Author.findById(req.user._id)
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

    const sanitizedContent = sanitizeHtml(body.content, {
      allowedTags: [
        "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
        "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
        "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
        "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
        "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
        "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "img"
      ],
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
      },
      // Lots of these won't come up by default because we don't allow them
      selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
      // URL schemes we permit
      allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
      allowProtocolRelative: true,
      enforceHtmlBoundary: false,
      parseStyleAttributes: true
    })

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
exports.BLOG_EDIT = [
  loginHandler,
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
      await unlinkAsync(req.file.path)
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body
    const blog = await Blog.findById(req.params.blogId).populate('topics')

    if (!blog) {
      res
        .status(404)
        .redirect('/blogs')
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

    // Check topics differences
    const removeBlogFromTopic = blog.topics.filter(topic => !topics.map(topic => topic.id).includes(topic.id))
    const addBlogToTopic = topics.filter(topic => !blog.topics.map(topic => topic.id).includes(topic.id))

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
    const sanitizedContent = sanitizeHtml(body.content, {
      allowedTags: [
        "address", "article", "aside", "footer", "header", "h1", "h2", "h3", "h4",
        "h5", "h6", "hgroup", "main", "nav", "section", "blockquote", "dd", "div",
        "dl", "dt", "figcaption", "figure", "hr", "li", "main", "ol", "p", "pre",
        "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn",
        "em", "i", "kbd", "mark", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp",
        "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "caption",
        "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "img"
      ],
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        // We don't currently allow img itself by default, but
        // these attributes would make sense if we did.
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ]
      },
      // Lots of these won't come up by default because we don't allow them
      selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
      // URL schemes we permit
      allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'tel' ],
      allowedSchemesByTag: {},
      allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
      allowProtocolRelative: true,
      enforceHtmlBoundary: false,
      parseStyleAttributes: true
    })

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.blogId, {
      title: body.title,
      caption: body.caption,
      content: sanitizedContent,
      topics: body.topics ? topics : [],
      thumbnail: req.file ? req.file.path : blog.thumbnail,
      isPublished: body.isPublished
    }, { 
      returnOriginal: false
    }).populate('topics')

    // Save and remove topic to and from blogs
    if (removeBlogFromTopic.length > 0) {
      const removedTopics = removeBlogFromTopic.map(topic => {
        const newTopic = topic;
        topic.blogs.filter(topicBlog => {
          return blog.id !== topicBlog.toString()
        })
        newTopic.blogs = topic.blogs.filter(topicBlog => blog.id !== topicBlog.toString())
        return newTopic
      })

      removedTopics.forEach(async (topic) => await topic.save())
    }

    if (addBlogToTopic.length > 0) {
      const savedToTopics = addBlogToTopic.map(topic => {
        topic.blogs.push(blog._id)
        return topic
      })
      savedToTopics.forEach(async (topic) => await topic.save())
    }

    console.log(updatedBlog)
    
    res.json({
      updatedBlog
    })
    }
]

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
    if (req.user) {
      author = await Author.findById(req.user.username)
    }
    
    if (!blog || (req.user && !author)) {
      res.status(400).json({
        error: 'Either blog or author doesn\'t exist'
      })
    }

    let comment
    if (req.user) {
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
    if (req.user) {
      author = await Author.findById(req.user.username)
    }
    
    if (!comment || (req.user && !author)) {
      res.status(400).json({
        error: 'Either blog or author doesn\'t exist'
      })
    }

    let reply
    if (req.user) {
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