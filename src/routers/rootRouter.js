'use strict';
// express
import express from 'express';
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from '../controllers/userControllers';
import { home, search } from '../controllers/videoControllers';
import { unknonwOnlyMiddleware } from '../middlewares';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter
  .route('/join')
  .all(unknonwOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rootRouter
  .route('/login')
  .all(unknonwOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;
