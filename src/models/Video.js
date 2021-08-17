import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 60 },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, minLength: 30 },
  tags: [{ type: String }],
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});

// Creating custum static functions for specific Schema
videoSchema.static('formatTags', function (tags) {
  return tags
    .split(',')
    .map((tag) => (tag.startsWith('#') ? tag.trim() : `#${tag.trim()}`));
});

// Schema middlewares : pre, post ...
//
// videoSchema.pre('save', async function () {
//   this.title = this.title.charAt(0).toUpperCase() + this.title.slice(1);
//   this.description =
//     this.description.charAt(0).toUpperCase() + this.description.slice(1);
// });
// videoSchema.pre('update', async function () {
//   this.tags = await this.tags[0]
//     .split(',')
//     .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
// });

const Video = mongoose.model('Video', videoSchema);

export default Video;
