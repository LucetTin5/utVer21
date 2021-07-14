// GlobalRouter
export const trending = (req, res) => res.send('Trending Videos');
export const search = (req, res) => res.send('Search Video');

// VideoRouter
export const watch = (req, res) => res.send('Watch');
export const edit = (req, res) => res.send('Edit Video');
export const upload = (req, res) => res.send('Upload Video');
export const remove = (req, res) => res.send('Remove Video');
export const comments = (req, res) => res.send('Comments');
export const editComment = (req, res) => res.send('Edut Comment');
