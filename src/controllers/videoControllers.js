// GlobalRouter
let videos = [
  {
    title: 'video 1',
    id: 1,
    views: 1230,
    createdAt: '5 minutes ago',
  },
  {
    title: 'video 2',
    id: 2,
    views: 12322,
    createdAt: '2 minutes ago',
  },
  {
    title: 'video 3',
    id: 3,
    views: 12,
    createdAt: '10 seconds ago',
  },
];

export const trending = (req, res) =>
  res.render('home', { pageTitle: 'Home', videos });
export const search = (req, res) => res.send('Search Video');

// VideoRouter
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render('watch', { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render('edit', { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};
export const upload = (req, res) => res.send('Upload Video');
export const remove = (req, res) => res.send('Remove Video');
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
