const { default: fetch } = require('node-fetch');

const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');
const textarea = form.querySelector('textarea');
const btn = form.querySelector('button');

const getComment = (event) => {
  event.preventDefault();
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  sendComment(text, videoId);
};
const sendComment = (comment, videoId) => {
  fetch(`/api/videos/${videoId}/comments`, {
    method: 'POST',
  });
};
form.addEventListener('submit', getComment);
