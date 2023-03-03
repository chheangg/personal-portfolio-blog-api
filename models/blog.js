const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true, minLength: [3, "title is too short" ], maxLength: [64, "title is too long"] },
  thumbnail: { type: String },
  caption: {type: String, required: true, minLength: [5, "caption is too short"] , maxLength: [128, "caption is too long"]},
  author: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
  topics: [{ type: Schema.Types.ObjectId, required: true, ref: "Topic" }],
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true },
  isPublished: { type: Boolean, default: false },
  comments: [{ type: Schema.Types.ObjectId, required: true, ref: "Comment" }],
})

// Blog url
BlogSchema.virtual('url').get(() => `/blogs/${this._id}`);

// Blog id
BlogSchema.virtual('id').get(() => this._id)

// Ensure virtual fields are serialised.
BlogSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Blog', BlogSchema);