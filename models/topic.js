const mongoose = require('mongoose');

const { Schema } = mongoose;

const TopicSchema = new Schema({
  name: { type: String },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
});

// Topic url
TopicSchema.virtual('url').get(() => `/topics/${this._id}`);

// Topic id
TopicSchema.virtual('id').get(() => this._id)

module.exports = mongoose.model('Topic', TopicSchema);
