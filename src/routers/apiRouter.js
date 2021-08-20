import express from 'express';
import {
  registerView,
  newComment,
  deleteComment,
} from '../controllers/videoControllers';

const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-f]{24})/views', registerView);
apiRouter.post('/videos/:id([0-9a-f]{24})/comment', newComment);
apiRouter.post('/videos/:id([0-9a-f]{24})/delete-comment', deleteComment);
export default apiRouter;
