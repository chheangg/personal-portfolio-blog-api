const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// GET request for a specific Author
router.get('/:authorId', authorController.AUTHOR_DETAIL)

// PUT request for editing an Author
router.put('/:authorId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: AUTHOR_EDIT ${req.params.authorId}`))

module.exports = router;

