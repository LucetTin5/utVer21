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

app.use(logger);
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', globalRouter);
app.use('/user', userRouter);
app.use('/videos', videoRouter);

app.listen(PORT, () =>
  console.log(`✅ Server listening on port https://localhost:${PORT}`)
);
