import express from 'express';
import {
  registerView,
  newComment,
  deleteComment,
  modifyComment,
} from '../controllers/videoControllers';

const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-f]{24})/views', registerView);
apiRouter.post('/videos/:id([0-9a-f]{24})/comment', newComment);
apiRouter.post('/videos/:id([0-9a-f]{24})/delete-comment', deleteComment);
apiRouter.post('/videos/:id([0-9a-f]{24})/modify-comment', modifyComment);
export default apiRouter;
