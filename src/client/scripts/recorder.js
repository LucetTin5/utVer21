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
const tempFiles = {
  input: 'recording.webm',
  output: 'recording.mp4',
  thumb: 'thumbnail.jpg',
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const downloadRecord = async () => {
  recordBtn.removeEventListener('click', downloadRecord);
  recordBtn.innerText = 'Transcoding...';
  recordBtn.disabled = true;
  const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
  });

  await ffmpeg.load();
  ffmpeg.FS('writeFile', tempFiles.input, await fetchFile(videoFile));

  // video transcode
  await ffmpeg.run('-i', tempFiles.input, '-r', '24', tempFiles.output);
  // get thumbnail from video
  await ffmpeg.run(
    '-i',
    tempFiles.input,
    '-ss',
    '00:00:01',
    '-frames:v',
    '1',
    tempFiles.thumb
  );

  // Read file from FileSystem of ffmpeg
  const mp4File = ffmpeg.FS('readFile', tempFiles.output);
  const thumbFile = ffmpeg.FS('readFile', tempFiles.thumb);
  // Make Blob with file's buffer
  const mp4Blob = new Blob([mp4File.buffer], { type: 'video/mp4' });
  const thumbBlob = new Blob([thumbFile.buffer], { type: 'image/jpg' });
  // Create Url
  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);
  // Let user download recorded video, thumbnail

  downloadFile(mp4Url, 'recording.mp4');
  downloadFile(thumbUrl, 'thumbnail.jpg');

  // front에 더 이상 필요하지 않은 파일과 링크를 브라우저 메모리에서 제거한다.
  ffmpeg.FS('unlink', tempFiles.input);
  ffmpeg.FS('unlink', tempFiles.output);
  ffmpeg.FS('unlink', tempFiles.thumb);
  URL.revokeObjectURL(mp4File);
  URL.revokeObjectURL(thumbFile);
  URL.revokeObjectURL(videoFile);

  recordBtn.disabled = false;
  recordBtn.innerText = 'Record Again (4 seconds Video)';
  recordBtn.addEventListener('click', startRecord);
};

const startRecord = () => {
  recordBtn.removeEventListener('click', startRecord);
  recordBtn.innerText = 'Recording...';
  recordBtn.disabled = true;
  recorder = new MediaRecorder(stream, recordOptions);
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    recordBtn.addEventListener('click', downloadRecord);
    recordBtn.innerText = 'Download';
    recordBtn.disabled = false;
  };
  recorder.start();
  setTimeout(() => recorder.stop(), 4000);
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
