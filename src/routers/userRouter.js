'use strict';
// express
import express from 'express';
import { edit, logout, profile, remove } from '../controllers/userControllers';

const userRouter = express.Router();

userRouter.get('/edit', edit);
userRouter.get('/delete', remove);
userRouter.get('/logout', logout);
userRouter.get('/:id', profile);

export default userRouter;
