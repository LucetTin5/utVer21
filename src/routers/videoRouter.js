'use strict';
// express
import express from 'express';

import {
  watch,
  getEdit,
  postEdit,
  remove,
  comments,
  editComment,
  getUpload,
  postUpload,
} from '../controllers/videoControllers';
import {
  protectorMiddleware,
  uploadVideo,
  setCrossOrigin,
} from '../middlewares';

const videoRouter = express.Router();

// using RegEx to get params.id

videoRouter
  .route('/upload')
  .all(protectorMiddleware)
  .get(setCrossOrigin, getUpload)
  .post(
    uploadVideo.fields([
      { name: 'video', maxCount: 1 },
      { name: 'thumb', maxCount: 1 },
    ]),
    postUpload
  );
videoRouter.get('/:id([0-9a-f]{24})', watch);
videoRouter
  .route('/:id([0-9a-f]{24})/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get('/:id([0-9a-f]{24})/delete', protectorMiddleware, remove);
// videoRouter.get('/:id([0-9a-f]{24})/comments', comments);
// videoRouter.get('/:id([0-9a-f]{24})/comments/:id/edit', editComment);

export default videoRouter;
