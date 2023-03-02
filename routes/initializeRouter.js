const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');

// POST request for creating an Admin Author
router.get('/', (req, res) => res.render('initialize'));

// POST request for creating an Admin Author
router.post('/', authorController.AUTHOR_ADMIN_CREATE);

module.exports = router;