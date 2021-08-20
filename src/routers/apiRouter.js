import express from 'express';
import { currentUser } from '../controllers/userControllers';
import { registerView, newComment } from '../controllers/videoControllers';

const apiRouter = express.Router();

apiRouter.post('/videos/:id([0-9a-f]{24})/views', registerView);
apiRouter.post('/videos/:id([0-9a-f]{24})/comment', newComment);
apiRouter.get('/user/current', currentUser);
export default apiRouter;
