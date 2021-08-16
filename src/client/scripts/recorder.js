import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const video = document.getElementById('preview');
const recordBtn = document.getElementById('recordBtn');

let stream;
let recorder;
let videoFile;

const recordOptions = {
  auidoBitsPerSecond: 128000,
  videoBitsPerSecond: 2500000,
  mimeType: 'video/webm',
};

const downloadRecord = async () => {
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  });

  await ffmpeg.load();
  ffmpeg.FS('writeFile', 'recording.webm', await fetchFile(videoFile));

  await ffmpeg.run('-i', 'recording.webm', '-r', '24', 'output.mp4');

  const mp4File = ffmpeg.FS('readFile', 'output.mp4');
  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const mp4Url = URL.createObjectURL(mp4Blob);

  const a = document.createElement('a');
  a.href = mp4Url;
  a.download = 'recording.mp4';
  document.body.appendChild(a);
  a.click();
};

const stopRecord = () => {
  recordBtn.innerText = 'Download Recording';
  recordBtn.removeEventListener('click', stopRecord);
  recordBtn.addEventListener('click', downloadRecord);
  recorder.stop();
};

const startRecord = () => {
  recordBtn.innerText = 'Stop Recording';
  recordBtn.removeEventListener('click', startRecord);
  recordBtn.addEventListener('click', stopRecord);
  recorder = new MediaRecorder(stream, recordOptions);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const pageInit = async () => {
  recordBtn.addEventListener('click', startRecord);
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    video.srcObject = stream;
    video.play();
  } catch (err) {
    console.log(err);
  }
};

pageInit();
