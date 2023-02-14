const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: { type: String, required: true, minLength: [3, "title is too short" ], maxLength: [100, "title is too long"] },
  caption: {type: String, required: true, minLength: [5, "caption is too short"] , maxLength: [100, "caption is too long"]},
  author: { type: Schema.Types.ObjectId, required: true, ref: "Author" },
  topic: [{ type: Schema.Types.ObjectId, required: true, ref: "Topic" }],
  timestamp: { type: Date, default: Date.now },
  sections: [
    {
      type: { type: String, enum: ['Header1', 'Header2', 'Paragraph', 'Image', 'Code'], required: true },
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