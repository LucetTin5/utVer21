'use strict';
// express, dotenv
import express from 'express';

// middlewares for server
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import flash from 'express-flash';
// middlewares customized
import { localsMiddlewares } from './middlewares';

// Routers
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';

const app = express();
const logger = morgan('dev');

app.use(logger);
app.set('view engine', 'pug');
app.set('views', process.cwd() + '/src/views');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// session : 백엔드 -> 브라우저 ""id"" 부여, 매 req마다 자동으로 cookie가 함께 전송
// resave : session에 변경사항이 없을 시에도 req마다 매번 저장하는 것(true) - false는 특정 시점에만 저장하도록 한다.
// saveUninitialized : 내용 없는 session은 저장하지 않음. == Uninit session은 저장하지 않음 - 쿠키 사용정책을 따름 + 서버 스토리지 절약
// connect-mongo -> MongoStore, 세션을 mongodb에 저장함
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);
// flash는 res.locals.messages를 생성한다.
app.use(flash());
// locals에 정보를 저장하는 미들웨어는 session보다 아래에 위치해야 locals가 session에 접근 가능하다.
app.use(localsMiddlewares);

app.use('/uploads', express.static('uploads'));
app.use('/assets', express.static('assets'));

app.use('/', rootRouter);
app.use('/user', userRouter);
app.use('/videos', videoRouter);
app.use('/api', apiRouter);
export default app;
