const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// POST request for creating an Author
router.post('/sign-up', authorController.AUTHOR_CREATE);

module.exports = router;