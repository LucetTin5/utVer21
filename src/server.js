'use strict';
// express
import express from 'express';

// middlewares for server
import morgan from 'morgan';

// middlewares customized

// Routers
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();
const logger = morgan('dev');

app.use(logger);
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(globalVariables());
app.use('/', rootRouter);
app.use('/user', userRouter);
app.use('/videos', videoRouter);

export default app;
