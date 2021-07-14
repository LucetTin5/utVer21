'use strict';
// express
import express from 'express';
import { trending } from '../controllers/videoControllers';

const globalRouter = express.Router();

const handleHome = (req, res) => res.send('Home');

globalRouter.get('/', trending);
// globalRouter.get('/join');
// globalRouter.get('/login');
// globalRouter.get('/search');

export default globalRouter;
