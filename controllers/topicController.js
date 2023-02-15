const Topic = require('../models/topic')
const Blog = require('../models/blog')

exports.TOPIC_LIST = async (req, res) => {
  const topics = await Topic.find({})
  res.json({
    topics
  })
}

exports.TOPIC_CREATE = (req, res) => {
  res.json('ROUTE NOT IMPLEMENTED: TOPIC_CREATE')
}

exports.TOPIC_DETAIL = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_DETAIL ${req.params.topicId}`)
}

exports.TOPIC_EDIT = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_EDIT ${req.params.topicId}`)
}

exports.TOPIC_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: TOPIC_DELETE ${req.params.topicId}`)
}

