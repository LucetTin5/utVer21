'use strict';
// express
import express from 'express';

import {
  watch,
  edit,
  remove,
  comments,
  editComment,
  upload,
} from '../controllers/videoControllers';

const videoRouter = express.Router();

videoRouter.get('/:id', watch);
videoRouter.get('/upload', upload);
videoRouter.get('/:id/edit', edit);
videoRouter.get('/:id/delete', remove);
videoRouter.get('/:id/comments', comments);
videoRouter.get('/:id/comments/:id/edit', editComment);

export default videoRouter;
