import express from 'express';
import { registerView, newComment } from '../controllers/videoControllers';

const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-f]{24})/views', registerView);
apiRouter.post('/videos/:id([0-9a-f]{24})/comment', newComment);

export default apiRouter;
