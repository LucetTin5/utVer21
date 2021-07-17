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
  upload,
} from '../controllers/videoControllers';

const videoRouter = express.Router();

// using RegEx to get params.id

videoRouter.get('/upload', upload);
videoRouter.get('/:id(\\d+)', watch);
videoRouter.route('/:id(\\d+)/edit').get(getEdit).post(postEdit);
// videoRouter.get('/:id(\\d+)/delete', remove);
// videoRouter.get('/:id(\\d+)/comments', comments);
// videoRouter.get('/:id(\\d+)/comments/:id/edit', editComment);

export default videoRouter;
