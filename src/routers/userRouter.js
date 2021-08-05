'use strict';
// express
import express from 'express';
import { protectorMiddleware, unknonwOnlyMiddleware } from '../middlewares';
import {
  getEdit,
  postEdit,
  logout,
  profile,
  remove,
  startGitHubLogin,
  finishGitHubLogin,
  getChangePassword,
  postChangePassword,
} from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/logout', protectorMiddleware, logout);
userRouter.get('/github/start', unknonwOnlyMiddleware, startGitHubLogin);
userRouter.get('/github/finish', unknonwOnlyMiddleware, finishGitHubLogin);
// userRouter.get('/delete', remove);
// userRouter.get('/:id', profile);

export default userRouter;
