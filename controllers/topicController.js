const Topic = require('../models/topic')
const Blog = require('../models/blog')
const { body, validationResult } = require('express-validator')

exports.TOPIC_LIST = async (req, res) => {
  const topics = await Topic.find({})
  res.json({
    topics
  })
}

exports.TOPIC_CREATE = [
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
    const topic = new Topic({
      name: body.name
    })

    console.log('hey')

    await topic.save()

    res.json({
      topic
    })
  }
]

exports.TOPIC_DETAIL = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_DETAIL ${req.params.topicId}`)
}

exports.TOPIC_EDIT = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_EDIT ${req.params.topicId}`)
}

exports.TOPIC_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_DELETE ${req.params.topicId}`)
}

