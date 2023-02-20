const mongoose = require('mongoose');
const Author = require('./author')

const { Schema } = mongoose;

const CommentSchema = new Schema({
  blog: { type: Schema.Types.ObjectId, required: true, ref: 'Blog' },
  author: { type: Schema.Types.ObjectId, ref: 'Author', },
  name: { type: String, minLength: 3, maxLength: 256 },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true, maxLength: 256 },
  replies: [{ type: Schema.Types.ObjectId, required: true, ref: 'Reply' }],
});

// Comment id
CommentSchema.virtual('id').get(() => this._id)

// Ensure virtual fields are serialised.
CommentSchema.set('toJSON', {
  virtuals: true
})

module.exports = mongoose.model('Comment', CommentSchema);
