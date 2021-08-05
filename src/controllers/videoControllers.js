'use strict';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ createdAt: 'desc' });
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
    }).sort({ createdAt: 'desc' });
    return res.render('./videos/search', {
      pageTitle: `Search by ${keyword}`,
      videos,
    });
  } catch (err) {
    console.log(err);
    return window.history.back();
  }
};

// VideoRouter
export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      throw new Error('Video not found');
    }
    return res.render('./videos/watch', { pageTitle: video.title, video });
  } catch (err) {
    console.log(err);
    return res.status(404).render('404', { pageTitle: 'Video not found' });
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
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
  const { id } = req.params;
  const { title, description, tags } = req.body;
  try {
    if (!(await Video.exists({ _id: id }))) {
      throw Error;
    }
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      tags: Video.formatTags(tags),
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.redirect(`./videos/${id}/edit`);
  }
};

export const getUpload = (req, res) =>
  res.render('./videos/upload', { pageTitle: 'Upload Video' });

export const postUpload = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    await Video.create({
      title,
      description,
      tags: Video.formatTags(tags),
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.render('./videos/upload', {
      pageTitle: 'Upload Video',
      errMsg: err._message,
    });
  }
};
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return window.history.back();
  }
};
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
