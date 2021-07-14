'use strict';
// express
import express from 'express';
import { join, login } from '../controllers/userControllers';
import { search, trending } from '../controllers/videoControllers';

const globalRouter = express.Router();

const handleHome = (req, res) => res.send('Home');

globalRouter.get('/', trending);
globalRouter.get('/join', join);
globalRouter.get('/login', login);
globalRouter.get('/search', search);

export default globalRouter;
