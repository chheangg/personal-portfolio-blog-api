const Blog = require('../models/blog')
const Author = require('../models/author')

exports.BLOG_LIST = async (req, res) => {
  const blogs = await Blog.find({})
    .populate('comments')
  res.json({
    blogs
  })
}

exports.BLOG_CREATE = async (req, res) => {
  // const author = await Author.findById('63d77e02d7289c7834d09a06')
  // const blog = new Blog({
  //   title: 'How to debate?',
  //   caption: 'Nunc porta lorem non velit porttitor, sit amet pulvinar',
  //   author: author,
  //   timestamp: Date.now(),
  //   sections: [
  //     {
  //       type: "Header",
  //       content: "How to debate?"
  //     },
  //     {
  //       type: "Paragraph",
  //       content: "This blog will teach you how to debate!"
  //     },
  //     {
  //       type: "Header",
  //       content: "Lorem ipsum dolor sit amet"
  //     },
  //     {
  //       type: "Paragraph",
  //       content: "Nunc porta lorem non velit porttitor, sit amet pulvinar dui dictum. Sed congue blandit porta. Phasellus viverra, orci non ultricies ullamcorper, lacus justo venenatis neque, eu sollicitudin justo sapien quis quam. Aenean quam sapien, pharetra sit amet metus nec, dapibus tincidunt est. Fusce vel tristique nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec feugiat lectus non lorem ullamcorper, non iaculis ipsum ultricies. Morbi facilisis nisi at nunc sollicitudin semper. Aenean vestibulum, quam ut accumsan aliquet, sapien mauris lacinia neque, ut lobortis magna tortor vitae dolor. Vivamus malesuada mollis sem quis suscipit. Morbi in tristique libero. Donec eu interdum massa, a posuere massa."
  //     },
  //     {
  //       type: "Header",
  //       content: "Lorem ipsum dolor sit amet"
  //     },
  //     {
  //       type: "Paragraph",
  //       content: "Nunc porta lorem non velit porttitor, sit amet pulvinar dui dictum. Sed congue blandit porta. Phasellus viverra, orci non ultricies ullamcorper, lacus justo venenatis neque, eu sollicitudin justo sapien quis quam. Aenean quam sapien, pharetra sit amet metus nec, dapibus tincidunt est. Fusce vel tristique nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec feugiat lectus non lorem ullamcorper, non iaculis ipsum ultricies. Morbi facilisis nisi at nunc sollicitudin semper. Aenean vestibulum, quam ut accumsan aliquet, sapien mauris lacinia neque, ut lobortis magna tortor vitae dolor. Vivamus malesuada mollis sem quis suscipit. Morbi in tristique libero. Donec eu interdum massa, a posuere massa."
  //     },
  //     {
  //       type: "Header",
  //       content: "Lorem ipsum dolor sit amet"
  //     },
  //     {
  //       type: "Paragraph",
  //       content: "Nunc porta lorem non velit porttitor, sit amet pulvinar dui dictum. Sed congue blandit porta. Phasellus viverra, orci non ultricies ullamcorper, lacus justo venenatis neque, eu sollicitudin justo sapien quis quam. Aenean quam sapien, pharetra sit amet metus nec, dapibus tincidunt est. Fusce vel tristique nisi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec feugiat lectus non lorem ullamcorper, non iaculis ipsum ultricies. Morbi facilisis nisi at nunc sollicitudin semper. Aenean vestibulum, quam ut accumsan aliquet, sapien mauris lacinia neque, ut lobortis magna tortor vitae dolor. Vivamus malesuada mollis sem quis suscipit. Morbi in tristique libero. Donec eu interdum massa, a posuere massa."
  //     }
  //   ]
  // })

  // await blog.save()
  // res.json({
  //   blog
  // })
  res.json(`ROUTE NOT IMPLEMENTED: BLOG_CREATE`)
  
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