const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const newComment = (event) => {
  event.preventDefault();
  const textarea = form.querySelector('textarea');
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (!text) {
    return;
  } else {
    sendComment(text, videoId);
  }
};
const sendComment = (comment, videoId) => {
  fetch(`/api/videos/${videoId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment,
    }),
  });
};

if (form) {
  form.addEventListener('submit', newComment);
}
