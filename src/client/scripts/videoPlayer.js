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
// __volume
const defaultVolume = '1.0';
let volumeValue = defaultVolume;
video.volume = volumeValue;
// __for controls
let controlsMovementTimeout = null;
let controlsLeaveTimeout = null;

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
    volumeValue = defaultVolume;
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
const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenBtnIcon.classList = 'fas fa-expand';
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtnIcon.classList = 'fas fa-compress';
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
  const { keyCode } = event;
  if (keyCode === 32) {
    handleVideoPlay();
  } else if (keyCode === 13) {
    handleFullScreen();
  } else if (keyCode === 39) {
    video.currentTime += 5;
  } else if (keyCode === 37) {
    video.currentTime -= 5;
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
fullscreenBtn.addEventListener('click', handleFullScreen);
// controls
videoContainer.addEventListener('mousemove', handleMouseMove);
videoContainer.addEventListener('mouseleave', handleMouseLeave);
videoContainer.addEventListener('dblclick', handleFullScreen);
videoContainer.addEventListener('mousedown', handleVideoPlay);
document.addEventListener('keydown', handleKeyDown);
// apis
video.addEventListener('ended', handleEnded);
