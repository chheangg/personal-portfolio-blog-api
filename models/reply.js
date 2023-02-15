const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const ReplySchema = new Schema({
  comment: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Author' },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true, maxLength: 256 },
})

// Reply id
ReplySchema.virtual('id').get(() => this._id)

// Ensure virtual fields are serialised.
ReplySchema.set('toJSON', {
  virtual: true
})

module.exports = mongoose.model('Reply', ReplySchema)