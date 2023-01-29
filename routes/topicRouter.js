const express = require('express');
const router = express.Router();

// GET request for a list of topics
router.get('/', (req, res) => res.json('ROUTE NOT IMPLEMENTED: TOPIC_LIST'))

// POST request for creating topics
router.post('/', (req, res) => res.json('ROUTE NOT IMPLEMENTED: TOPIC_CREATE'))

// GET request for a specific topic
router.get('/:topicId', (req, res) => res.json('ROUTE NOT IMPLEMENTED: TOPIC_DETAIL'))

// PUT request for editing a specific topic
router.put('/:topicId', (req, res) => res.json('ROUTE NOT IMPLEMENTED: TOPIC_EDIT'))

module.exports = router;