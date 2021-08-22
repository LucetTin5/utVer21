import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import fs from 'fs';

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});
export const isHeroku = () => (process.env.NODE_ENV ? true : false);

export const localsMiddlewares = (req, res, next) => {
  res.locals.siteName = 'Wetube';
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user ?? {};
  res.locals.isHeroku = isHeroku();
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
const deleteTarget = (req) => {
  if (!req.file) {
    // delete video
    return String(`/uploads/videos/${req.params.id}`);
  } else {
    // delete last avatar
    return String(req.session.loggedInUser.avatarUrl);
  }
};
export const deleteAvatar = (req, res, next) => {
  return isHeroku()
    ? deleteS3Avatar(req, res, next)
    : deleteLocalUpload(req, res, next);
};
export const deleteVideo = () => {
  return isHeroku()
    ? deleteS3Video(req, res, next)
    : deleteLocalUpload(req, res, next);
};
const deleteLocalUpload = (req, res, next) => {
  if (isHeroku()) {
    return next();
  } else {
    const target = deleteTarget(req);
    fs.unlink(target, (err) => {
      if (err) throw err;
      console.log('File Deleted');
    });
  }
  next();
};

const deleteS3Option = (name) => {
  return {
    Bucket: `akitznomae/${name}`,
    Key: String(req.session.loggedInUser.avatarUrl).match(/[0-9a-z]+$/),
  };
};
const deleteS3Video = (req, res, next) => {
  if (!isHeroku()) {
    // production only - aws delete
    return next();
  }
  if (!req.file) {
    return next();
  } else {
    s3.deleteObject(deleteS3Option('video'), (err, data) => {
      if (err) {
        console.log('Failed', err);
        throw err;
      }
      console.log('S3 Object deleted', data);
    });
  }
  next();
};
const deleteS3Avatar = (req, res, next) => {
  if (!isHeroku()) {
    // production only - aws delete
    return next();
  }
  if (!req.file) {
    return next();
  } else {
    s3.deleteObject(deleteS3Option('avatar'), (err, data) => {
      if (err) {
        console.log('Failed', err);
        throw Error(err);
      }
      console.log('S3 Object deleted', data);
    });
  }
  next();
};

const avatarStorage = multerS3({
  s3: s3,
  bucket: 'akitznomad/avatar',
  acl: 'public-read',
});
const videoStorage = multerS3({
  s3: s3,
  bucket: 'akitznomad/video',
  acl: 'public-read',
});
export const uploadAvatar = multer({
  dest: 'uploads/avatar/',
  limits: {
    fileSize: 5 * 1e6,
  },
  storage: isHeroku() ? avatarStorage : undefined,
});
export const uploadVideo = multer({
  dest: 'uploads/videos/',
  limits: {
    fileSize: 20 * 1e6,
  },
  storage: isHeroku() ? videoStorage : undefined,
});
export const setCrossOrigin = (_, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
};
