const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Author' },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true, maxLength: 256 },
  replies: [{ type: Schema.Types.ObjectId, required: true, ref: 'Reply' }],
})

module.exports = mongoose.model('Comment', CommentSchema)