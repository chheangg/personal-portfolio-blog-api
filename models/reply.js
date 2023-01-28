const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  comment: { type: Schema.Types.ObjectId, required: true, ref: 'Comment' },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Author' },
  timestamp: { type: Date, default: Date.now },
  content: { type: String, required: true, maxLength: 256 },
})

module.exports = mongoose.model('Reply', ReplySchema)