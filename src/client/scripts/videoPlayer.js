// video player
// video tag는 HTMLMediaElement를 상속한다.
const video = document.querySelector('video');
const videoContainer = document.getElementById('videoContainer');
const videoControls = document.getElementById('videoControls');
// video control buttons
const playBtn = document.getElementById('play');
const playBtnIcon = playBtn.querySelector('i');
const muteBtn = document.getElementById('mute');
const muteBtnIcon = muteBtn.querySelector('i');
const time_display = document.getElementById('time-display');
const time_current = document.getElementById('time-current');
const time_duration = document.getElementById('time-duration');
const timeline = document.getElementById('timeline');
const volumeRange = document.getElementById('volume');
const fullscreenBtn = document.getElementById('fullscreen');
const fullscreenBtnIcon = fullscreenBtn.querySelector('i');

// Values
// __video focused
let videoFocused = false;
// __volume
const defaultVolume = '1.0';
let volumeValue = defaultVolume;
video.volume = volumeValue;
// __for controls
let controlsMovementTimeout = null;
let controlsLeaveTimeout = null;
// __fullscreen
let fullscreen = false;
//EventHandlers
// __playbtn
const handleVideoPlay = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? 'fas fa-play' : 'fas fa-pause';
};
// __volume - mute - volumerange
const handleVideoMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? 'fas fa-volume-mute'
    : 'fas fa-volume-up';
  volumeRange.value = video.muted ? 0 : volumeValue;
};
const handleVolumeRange = (event) => {
  const {
    target: { value },
  } = event;
  if (value === '0') {
    handleVideoMute();
  }
  volumeValue = value === '0' ? defaultVolume : value;
  video.volume = volumeValue;
};
// __time
const formatTime = (seconds) => {
  const time = new Date(seconds * 1000).toISOString().substr(11, 8);
  if (Number(seconds) < 3600) {
    return time.slice(3);
  }
  return time;
};
const handleLoadedMetaData = () => {
  time_duration.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
  timeline.value = 0;
};
const handleTimeUpdate = () => {
  time_current.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};
const handleTimeControl = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};
// Screen
const handleFullScreenBtn = () => {
  if (fullscreen) {
    document.exitFullscreen();
  } else {
    videoContainer.requestFullscreen();
  }
};
// Container Events
const removeShowing = () => videoControls.classList.remove('showing');
const handleMouseMove = () => {
  if (controlsLeaveTimeout) {
    clearTimeout(controlsLeaveTimeout);
    controlsLeaveTimeout = null;
  }
  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  }
  videoControls.classList.add('showing');
  // 비디오 안에서 마우스의 움직임이 계속 타임아웃 스택을 추가한다.
  // 새로 실행될 경우 이전의 타임아웃 스택은 제거하고 새로운 스택을 더한다.
  // 움직임이 더 이상 없을 경우 타임아웃의 제거 / 새로운 생성이 존재하지 않기에 타임아웃이 실행된다.
  controlsMovementTimeout = setTimeout(removeShowing, 3000);
};
const handleMouseLeave = () => {
  controlsLeaveTimeout = setTimeout(removeShowing, 3000);
};
const handleKeyDown = (event) => {
  const { code } = event;
  if (videoFocused) {
    switch (code) {
      case 'KeyF':
        if (!fullscreen) {
          videoContainer.requestFullscreen();
        }
        break;
      case 'Escape':
        if (fullscreen) {
          document.exitFullscreen();
        }
        break;
      case 'Space':
        handleVideoPlay();
    }
  }
};
const handleFocused = (event) => {
  const { target } = event;
  if (videoContainer.contains(target)) {
    videoFocused = true;
  } else {
    videoFocused = false;
  }
};
const handleFullScreen = () => {
  const isFull = document.fullscreenElement;
  if (isFull) {
    fullscreen = true;
    fullscreenBtnIcon.classList = 'fas fa-compress';
  } else {
    fullscreen = false;
    fullscreenBtnIcon.classList = 'fas fa-expand';
  }
};
// Apis
const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/views`, {
    method: 'POST',
  });
};
// EventListeners
// play
playBtn.addEventListener('click', handleVideoPlay);
// volume
muteBtn.addEventListener('click', handleVideoMute);
volumeRange.addEventListener('input', handleVolumeRange);
// time
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
timeline.addEventListener('input', handleTimeControl);
// screen
fullscreenBtn.addEventListener('click', handleFullScreenBtn);
// controls
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
videoContainer.addEventListener('dblclick', handleFullScreenBtn);
videoContainer.addEventListener('mousedown', handleVideoPlay);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('click', handleFocused);
document.addEventListener('fullscreenchange', handleFullScreen);
// apis
video.addEventListener('ended', handleEnded);

if (video.readyState >= 4) {
  handleLoadedMetaData();
}
