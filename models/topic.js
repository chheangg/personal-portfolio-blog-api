const mongoose = require('mongoose');

const { Schema } = mongoose;

const TopicSchema = new Schema({
  name: { type: String, required: true },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
});

// Topic url
TopicSchema.virtual('url').get(() => `/topics/${this._id}`);

// Topic id
TopicSchema.virtual('id').get(() => this._id)

// Ensure virtual fields are serialised.
TopicSchema.set('toJSON', {
  virtual: true
})

module.exports = mongoose.model('Topic', TopicSchema);
