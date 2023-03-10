const Topic = require('../models/topic')
const Blog = require('../models/blog')
const { body, validationResult } = require('express-validator')
const { loginHandler } = require('../utilities/middleware');

exports.TOPIC_LIST = async (req, res) => {
  console.log('hey')
  const topics = await Topic.find({})
  res.json({
    topics
  })
}

exports.TOPIC_CREATE = [
  loginHandler,
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Topic name must not be empty'),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body
    const sameTopic = await Topic.findOne({ name: body.name })

    if (sameTopic) {
      return res.status(400).json({ error: "Topic already exist" })
    }

    
    const topic = new Topic({
      name: body.name
    })

    await topic.save()

    res.json({
      topic
    })
  }
]

exports.TOPIC_DETAIL = async (req, res) => {
  const topic = await Topic.findById(req.params.topicId)
    .populate({
      path: 'blogs',
      populate: {
        path: 'author'
      }
    })

  if (!topic) {
    res.status(404).json({
      error: "Topic doesn't exist"
    })
    return
  }
  
  res.json({
    topic
  })
}

exports.TOPIC_EDIT = [
  loginHandler,
  body('name')
    .trim()
    .escape()
    .notEmpty().withMessage('Topic name must not be empty'),
  async (req, res) => {
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const body = req.body

    // Check if Topic exists
    const topic = await Topic.findById(req.params.topicId)

    if (!topic) {
      return res
        .status(404)
        .json({ error: "Topic isn't found" })
    }

    // Check if there is a topic by the same name
    const sameTopic = await Topic.findOne({ name: body.name })

    if (sameTopic) {
      return res.status(400).json({ error: "Topic name already taken" })
    }

    topic.name = body.name

    await topic.save()

    res.json({
      topic
    })
  }
]

exports.TOPIC_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_DELETE ${req.params.topicId}`)
}

