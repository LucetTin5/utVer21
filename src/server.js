'use strict';
// express
import express from 'express';

// env
import dotenv from 'dotenv';
dotenv.config();

// middlewares
import morgan from 'morgan';

// Routers
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const PORT = process.env.PORT || 8187;

const app = express();
const logger = morgan('dev');

const favBlock = (req, res, next) => {
  if (req.url === 'favicon.ico') {
    return next();
  }
  next();
};

app.use(favBlock);
app.use(logger);
app.use('/', globalRouter);
app.use('/user', userRouter);
app.use('/videos', videoRouter);

app.listen(PORT, () =>
  console.log(`✅ Server listening on port https://localhost:${PORT}`)
);
