import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Video' },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  comment: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  meta: {
    like: { type: Number, required: true, default: 0 },
    dislike: { type: Number, required: true, default: 0 },
  },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
