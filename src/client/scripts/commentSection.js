import fetch from 'node-fetch';

const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const commentTemplate = async (text) => {
  const userData = await (await fetch('/api/user/current')).json();
  const loggedInUser = JSON.parse(userData);
  console.log(loggedInUser);
  return `
    <div class='comment__writer' id=${loggedInUser}>
      <a href=${'/user/' + loggedInUser._id}>
        <img src=${
          loggedInUser.avatarUrl.startsWith('https://')
            ? loggedInUser.avatarUrl
            : '/' + loggedInUser.avatarUrl
        } alt=${loggedInUser.name} class="avatar avatar-small"/>
      </a>
    </div>
    <div class='comment__comment'>
      <span>${text}</span>
    </div>
    <div class='comment__buttons'>
      <button class='comment__buttons__likeBtn'>
        <span>0</span>
        <i class="far fa-thumbs-up"></i>
      </button>
      <button class='comment__buttons__dislikeBtn'>
        <span>0</span>
        <i class="far fa-thumbs-down"></i>
      </button>
    </div>
  `;
};

const fakeComment = async (text) => {
  const commentContainer = document.querySelector('.comment__container');
  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.innerHTML = await commentTemplate(text);
  commentContainer.appendChild(comment);
};

const newComment = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector('textarea');
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (!text) {
    return;
  } else {
    const res = await sendComment(text, videoId);
    if (res.status === 201) {
      fakeComment(text);
    }
    textarea.value = '';
  }
};
const sendComment = (comment, videoId) => {
  return fetch(`/api/videos/${videoId}/comment`, {
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
