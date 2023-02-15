const express = require('express');
const router = express.Router();

const topicController = require('../controllers/topicController')

// GET request for a list of topics
router.get('/', topicController.TOPIC_LIST)

// POST request for creating topics
router.post('/', topicController.TOPIC_CREATE)

// GET request for a specific topic
router.get('/:topicId', topicController.TOPIC_DETAIL)

// PUT request for editing a specific topic
router.put('/:topicId', topicController.TOPIC_EDIT)

// DELETE request for deleting a specific topic
router.delete('/:topicId', topicController.TOPIC_DELETE)

module.exports = router;