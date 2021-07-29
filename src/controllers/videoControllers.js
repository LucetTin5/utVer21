'use strict';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    console.log(err);
    return res.send(`<h1>Server-error</h1><br><p>${err}</p>`);
  }
};
export const search = (req, res) => res.send('Search Video');

// VideoRouter
export const watch = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (!video) {
      throw new Error('Video not found');
    }
    return res.render('watch', { pageTitle: video.title, video });
  } catch (err) {
    console.log(err);
    return res.render('404', { pageTitle: 'Video not found' });
  }
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    return res.render('edit', { pageTitle: `Edit: ${video.title}`, video });
  } catch (err) {
    console.log(err);
    return res.render('404', { pageTitle: 'Video not found' });
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
      tags,
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.redirect(`/videos/${id}/edit`);
  }
};

export const getUpload = (req, res) =>
  res.render('upload', { pageTitle: 'Upload Video' });

export const postUpload = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    await Video.create({
      title,
      description,
      tags,
    });
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.render('upload', {
      pageTitle: 'Upload Video',
      errorMessage: err._message,
    });
  }
};
export const remove = (req, res) => res.send('Remove Video');
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
