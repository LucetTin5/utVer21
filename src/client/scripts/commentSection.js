import fetch from 'node-fetch';

const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const targetComment = (node) => {
  while (node.className !== 'comment') {
    node = node.parentNode;
  }
  return node;
};
const modifyCommentFinish = async (event) => {
  event.preventDefault();
  const { target } = event;
  const comment = targetComment(target);
  const modifyBtn = comment.querySelector('.comment__buttons__modify');
  modifyBtn.removeEventListener('click', modifyComment);
  modifyBtn.disabled = true;
  const commentArea = comment.querySelector('.comment__comment');
  const commentSpan = commentArea.querySelector('span');
  const currentValue = commentSpan.innerText;
  const textarea = comment.querySelector('textarea');
  const text = textarea.value;
  commentSpan.innerText = text;
  commentSpan.setAttribute('style', 'display: inline');
  textarea.remove();

  const videoId = videoContainer.dataset.id;
  const commentId = comment.dataset.id;
  const ownerId = comment.querySelector('.comment__writer').dataset.id;
  if (text === currentValue) {
    // 변화없음
    return;
  } else {
    // front의 값은 위에서 이미 변경함 백에서 응답을 기다릴 필요가 없음.
    try {
      const { status } = await fetch(`/api/videos/${videoId}/modify-comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerId,
          commentId,
          comment: text,
        }),
      });
      if (status !== 201) {
        commentSpan.innerText = currentValue;
      }
    } catch (err) {
      console.log(err);
    }
  }
  const removeBtn = comment.querySelector('.comment__buttons__remove');
  removeBtn.disabled = false;
  modifyBtn.querySelector('i').className = 'far fa-edit';
  modifyBtn.removeEventListener('click', modifyCommentFinish);
  modifyBtn.addEventListener('click', modifyComment);
  modifyBtn.disabled = false;
};
const modifyComment = (event) => {
  event.preventDefault();
  const { target } = event;
  const comment = targetComment(target);
  const removeBtn = comment.querySelector('.comment__buttons__remove');
  removeBtn.disabled = true;
  const modifyBtn = comment.querySelector('.comment__buttons__modify');
  modifyBtn.querySelector('i').className = 'far fa-check-square';
  modifyBtn.removeEventListener('click', modifyComment);

  const commentArea = comment.querySelector('.comment__comment');
  const commentSpan = commentArea.querySelector('span');
  const currentValue = commentSpan.innerText;
  const textarea = document.createElement('textarea');
  textarea.cols = 40;
  textarea.rows = 3;
  textarea.value = currentValue;
  commentSpan.setAttribute('style', 'display:none');
  commentArea.appendChild(textarea);
  modifyBtn.addEventListener('click', modifyCommentFinish);
};

const deleteComment = async (event) => {
  const videoId = videoContainer.dataset.id;
  const { target } = event;
  const comment = targetComment(target);
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
          loggedInUser.avatarUrl.startsWith('http')
            ? loggedInUser.avatarUrl
            : '/' + loggedInUser.avatarUrl
        } alt=${loggedInUser.name} class="avatar avatar-small"/>
      </a>
    </div>
    <div class='comment__comment'>
      <span>${text}</span>
    </div>
    <div class='comment__buttons'>
      <button class='comment__buttons__modify'>
        <i class="far fa-edit"></i>
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
  comment.querySelector('.comment__writer').dataset.id = user._id;
  commentContainer.prepend(comment);
  const modifyBtn = comment.querySelector('.comment__buttons__modify');
  modifyBtn.addEventListener('click', modifyComment);
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
    const buttonsContainer = comment.querySelector('.comment__buttons');
    if (!buttonsContainer) {
      return;
    } else {
      const modifyBtn = comment.querySelector('.comment__buttons__modify');
      const removeBtn = comment.querySelector('.comment__buttons__remove');
      modifyBtn.addEventListener('click', modifyComment);
      removeBtn.addEventListener('click', deleteComment);
    }
  });
})();
