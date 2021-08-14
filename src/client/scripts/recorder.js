const startBtn = document.getElementById('startRecord');
const video = document.getElementById('preview');
const startRecord = async () => {
  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { width: 250, height: 250 },
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.log(err);
  }
};

startBtn.addEventListener('click', startRecord);
