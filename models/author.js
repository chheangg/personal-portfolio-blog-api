const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
})

// Book's URL
AuthorSchema.virtual('url').get(() => `/author/${this._id}`);

// Book's ID
AuthorSchema.virtual('id').get(() => this._id);

// Ensure virtual fields are serialised.
AuthorSchema.set('toJSON', {
  virtual: true
})

module.exports = mongoose.model('Author', AuthorSchema)