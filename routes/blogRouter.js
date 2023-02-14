const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController')

// GET request for all blogs
router.get('/', blogController.BLOG_LIST)

// POST request for creating a blog
router.post('/', blogController.BLOG_CREATE)

// GET request for a specific blog
router.get('/:blogId', blogController.BLOG_DETAIL)

// PUT request for editing a blog
router.put('/:blogId', blogController.BLOG_EDIT)

// DELETE request for editing a blog
router.delete('/:blogId', blogController.BLOG_DELETE)

// GET request for a blog's comments
router.get('/:blogId/comments/', blogController.COMMENT_LIST)

// POST request for a creating a blog
router.post('/:blogId/comments/', blogController.COMMENT_CREATE)

// GET request for a comment's replies
router.get('/:blogId/comments/:commentId/replies', blogController.REPLY_LIST)

// POST request for a creating a reply
router.post('/:blogId/comments/:commentId/replies', blogController.REPLY_CREATE)


module.exports = router;

