import fetch from 'node-fetch';

const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const deleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const { target } = event;
  const comment = ((node) => {
    while (node.className !== 'comment') {
      node = node.parentNode;
    }
    return node;
  })(target);
  const commentId = comment.dataset.id;
  try {
    const { status } = await fetch(`/api/videos/${videoId}/delete-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId,
      }),
    });
    if (status === 204) {
      comment.remove();
    }
  } catch (err) {
    console.log(err);
  }
};

const commentTemplate = (text, user) => {
  const loggedInUser = user;
  return `
    <div class='comment__writer'>
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
      <button class='comment__buttons__remove'>
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
};

const fakeComment = (text, commentId) => {
  const commentContainer = document.querySelector('.comment__container');
  const user = JSON.parse(commentContainer.dataset.current);
  const comment = document.createElement('div');
  comment.className = 'comment';
  comment.innerHTML = commentTemplate(text, user);
  comment.dataset.id = commentId;
  commentContainer.appendChild(comment);
  const removeBtn = comment.querySelector('.comment__buttons__remove');
  removeBtn.addEventListener('click', deleteComment);
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
      const { newCommentId } = await res.json();
      fakeComment(text, newCommentId);
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

(() => {
  const comments = document.querySelectorAll('.comment');
  comments.forEach((comment) => {
    const removeBtn = comment.querySelector('.comment__buttons__remove');
    if (!removeBtn) {
      return;
    } else {
      removeBtn.addEventListener('click', deleteComment);
    }
  });
})();
