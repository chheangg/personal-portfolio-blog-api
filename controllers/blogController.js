exports.BLOG_LIST = (req, res) => {
  res.json('ROUTE NOT IMPLEMENTED: BLOG_LIST')
}

exports.BLOG_CREATE = (req, res) => {
  res.json('ROUTE NOT IMPLEMENTED: BLOG_CREATE')
}

exports.BLOG_DETAIL = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_DETAIL ${req.params.blogId}`)
}

exports.BLOG_EDIT = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_EDIT ${req.params.blogId}`)
}

exports.BLOG_DELETE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_DELETE ${req.params.blogId}`)
}

exports.COMMENT_LIST = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: COMMENT_LIST ${req.params.blogId}`)
}

exports.COMMENT_CREATE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: COMMENT_CREATE ${req.params.blogId}`)
}

exports.REPLY_LIST = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_LIST ${req.params.blogId} / ${req.params.commentId}`)
}

exports.REPLY_CREATE = (req, res) => {
  res.json(`ROUTE NOT IMPLEMENTED: REPLY_CREATE ${req.params.blogId} / ${req.params.commentId}`)
}