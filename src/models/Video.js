import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, maxLength: 60 },
  description: { type: String, required: true, minLength: 30 },
  createdAt: { type: Date, required: true, default: Date.now },
  tags: [{ type: String }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

videoSchema.pre('save', async function () {
  this.tags = await this.tags[0]
    .split(',')
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
});

videoSchema.pre('update', async function () {
  this.tags = await this.tags[0]
    .split(',')
    .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
