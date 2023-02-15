const mongoose = require('mongoose');
const Comment = require('./comment')
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true, minLength: [3, "title is too short" ], maxLength: [64, "title is too long"] },
  caption: {type: String, required: true, minLength: [5, "caption is too short"] , maxLength: [256, "caption is too long"]},
  author: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
  topic: [{ type: Schema.Types.ObjectId, required: true, ref: "Topic" }],
  timestamp: { type: Date, default: Date.now },
  sections: [
    {
      type: { type: String, enum: ['Header', 'Paragraph', 'Image', 'Code'], required: true },
      content: { type: String, required: true },
    }
  ],
  comments: [{ type: Schema.Types.ObjectId, required: true, ref: "Comment" }],
})

// Blog url
BlogSchema.virtual('url').get(() => `/blogs/${this._id}`);

// Blog id
BlogSchema.virtual('id').get(() => this._id)

module.exports = mongoose.model('Blog', BlogSchema);