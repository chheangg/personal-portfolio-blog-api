const mongoose = require('mongoose');

const { Schema } = mongoose;

const TopicSchema = new Schema({
  name: { type: String },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
});

TopicSchema.virtual('url').get(() => `/topics/${this._id}`);

module.exports = mongoose.model('Topic', TopicSchema);
