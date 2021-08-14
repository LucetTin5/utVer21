'use strict';
import Video from '../models/Video';
import User from '../models/User';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({})
      .sort({ createdAt: 'desc' })
      .populate('owner');
    return res.render('./videos/home', { pageTitle: 'Home', videos });
  } catch (err) {
    console.log(err);
    return res.send(`<h1>Server-error</h1><br><p>${err}</p>`);
  }
};
// search에는 다양한 mongodb의 옵션을 사용하여 세부 내용을 지정할 수 있음.
export const search = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.render('./videos/search', { pageTitle: 'Search' });
    }
    const videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    })
      .sort({ createdAt: 'desc' })
      .populate('owner');
    return res.render('./videos/search', {
      pageTitle: `Search by ${keyword}`,
      videos,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).redirect('/');
  }
};

// VideoRouter
export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id).populate('owner');
    if (!video) {
      throw new Error('Video not found');
    }
    return res.render('./videos/watch', { pageTitle: video.title, video });
  } catch (err) {
    console.log(err);
    return res.status(404).render('404', { pageTitle: 'Video not found' });
  }
};
// Upload
export const getUpload = (req, res) =>
  res.render('./videos/upload', { pageTitle: 'Upload Video' });
export const postUpload = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    file: { path: fileUrl },
    body: { title, description, tags },
  } = req;
  try {
    const newVideo = await Video.create({
      title,
      fileUrl,
      description,
      tags: Video.formatTags(tags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.render('./videos/upload', {
      pageTitle: 'Upload Video',
      errMsg: err._message,
    });
  }
};
// Edit
export const getEdit = async (req, res) => {
  const {
    params: { id },
    session: {
      user: { _id },
    },
  } = req;
  try {
    const video = await Video.findById(id);
    console.log(video.owner, _id);
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect('/');
    }
    return res.render('./videos/edit', {
      pageTitle: `Edit: ${video.title}`,
      video,
    });
  } catch (err) {
    console.log(err);
    return res.status(404).render('404', { pageTitle: 'Video not found' });
  }
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    params: { id },
    body: { title, description, tags },
  } = req;
  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).render('404', { pageTitle: 'Video not found' });
    }
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      tags: Video.formatTags(tags),
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).redirect(`/videos/${id}/edit`);
  }
};
export const remove = async (req, res) => {
  const {
    session: {
      user: { _id, videos },
    },
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    if (String(video.owner) !== String(_id)) {
      return res.status(403).redirect('/');
    }
    videos = videos.filter((videoId) => videoId !== id);
    await Video.findByIdAndDelete(id);
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { videos },
      { new: true }
    );
    req.session.user = updatedUser;
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return window.history.back();
  }
};
export const registerView = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    video.meta.views++;
    video.save();
    // status Code를 보내고 종료하려면 sendStatus를 설정
    // status code를 포함시킨 res를 전달하려면 .status().-- 를 사용
    return res.sendStatus(200);
  } catch (err) {
    console.log(err);
    return res.sendStatus(404);
  }
};
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
