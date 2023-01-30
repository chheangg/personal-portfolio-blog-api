const express = require('express');
const router = express.Router();

// GET request for all blogs
router.get('/', (req, res) => res.json('ROUTE NOT IMPLEMENTED: BLOG_LIST'))

// POST request for creating a blog
router.post('/', (req, res) => res.json('ROUTE NOT IMPLEMENTED: BLOG_CREATE'))

// GET request for a specific blog
router.get('/:blogId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: BLOG_DETAIL ${req.params.blogId}`))

// PUT request for editing a blog
router.put('/:blogId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: BLOG_EDIT ${req.params.blogId}`))

// DELETE request for editing a blog
router.delete('/:blogId', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: BLOG_DELETE ${req.params.blogId}`))

// GET request for a blog's comments
router.get('/:blogId/comments/', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: COMMENT_LIST ${req.params.blogId}`))

// POST request for a creating a blog
router.post('/:blogId/comments/', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: COMMENT_CREATE ${req.params.blogId}`))

// GET request for a comment's replies
router.get('/:blogId/comments/:commentId/replies', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: REPLY_LIST ${req.params.blogId} / ${req.params.commentId}`))

// POST request for a creating a reply
router.post('/:blogId/comments/:commentId/replies', (req, res) => res.json(`ROUTE NOT IMPLEMENTED: REPLY_CREATE ${req.params.blogId} / ${req.params.commentId}`))


module.exports = router;

