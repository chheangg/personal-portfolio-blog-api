const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// GET request for a specific Author
router.get('/:authorId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: AUTHOR_DETAIL ${req.params.authorId}`))

// PUT request for editing an Author
router.put('/:authorId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: AUTHOR_EDIT ${req.params.authorId}`))

module.exports = router;

