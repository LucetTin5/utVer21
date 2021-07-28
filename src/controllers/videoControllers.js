'use strict';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render('home', { pageTitle: 'Home' });
  } catch (err) {
    console.log(err);
    return res.send(`<h1>Server-error</h1><br><p>${err}</p>`);
  }
};
export const search = (req, res) => res.send('Search Video');

// VideoRouter
export const watch = (req, res) => {
  const { id } = req.params;
  try {
  } catch (err) {
    console.log(err);
  }
  return res.render('watch', { pageTitle: `Watching` });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  res.render('edit', { pageTitle: `Editing` });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  // const { title } = req.body;
  res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) =>
  res.render('upload', { pageTitle: 'Upload Video' });
export const postUpload = async (req, res) => {
  const { title, description, tags } = req.body;
  try {
    // newVideo = new Video -> save() or Video.create()
    await Video.create({
      title,
      description,
      createdAt: Date.now(),
      tags: tags.split(',').map((tag) => `#${tag}`),
      meta: {
        views: 0,
        rating: 0,
      },
    });
  } catch (err) {
    console.log(err);
    return res.redirect('/');
  }
};
export const remove = (req, res) => res.send('Remove Video');
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
