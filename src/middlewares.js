import multer from 'multer';

export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = 'Wetube';
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user ?? {};
  next();
};

export const protectorMiddleware = (req, res, next) => {
  // 로그인된 사용자만 접근 가능하도록
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash('error', 'Unauthorized access');
    return res.redirect('/');
  }
};

export const unknonwOnlyMiddleware = (req, res, next) => {
  // 로그인되지 않은 사용자만 접근할 수 있도록
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash('error', 'Unauthorized access');
    return res.redirect('/');
  }
};

export const uploadAvatar = multer({
  dest: 'uploads/avatar/',
  limits: {
    fileSize: 5 * 1e6,
  },
});
export const uploadVideo = multer({
  dest: 'uploads/videos/',
  limits: {
    fileSize: 20 * 1e6,
  },
});
export const setCrossOrigin = (_, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
};
