'use strict';
// express
import express from 'express';
import {
  edit,
  logout,
  profile,
  remove,
  startGitHubLogin,
  finishGitHubLogin,
} from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/edit', edit);
userRouter.get('/delete', remove);
userRouter.get('/logout', logout);
userRouter.get('/github/start', startGitHubLogin);
userRouter.get('/github/finish', finishGitHubLogin);
// userRouter.get('/:id', profile);

export default userRouter;
