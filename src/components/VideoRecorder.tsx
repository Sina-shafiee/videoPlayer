import { useRef, useState } from 'react';
import uploadVideo from '../api/uploadVideo';
import useCamera from '../hooks/useCamera';
import useRecorder from '../hooks/useRecorder';
import VideoPlayer from './VideoPlayer';

const VideoRecorder = () => {
  const liveVideoPreview = useRef<HTMLVideoElement>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [permission, getCameraPermission, stream] = useCamera(liveVideoPreview);
  const [recordingStatus, startRecording, stopRecording, videoSize] =
    useRecorder(stream, setRecordedVideo);

  const handleUpload = async () => {
    const config = {
      onUploadProgress: function (progressEvent: ProgressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        if (percentCompleted < 100) {
          setUploadProgress(percentCompleted);
        } else if (percentCompleted === 100) {
          setUploadProgress(0);
        }
      }
    };

    if (recordedVideo) {
      const mediaBlob = await fetch(recordedVideo);
      const webmBlob = await mediaBlob.blob();

      const mp4File = new File([webmBlob], 'demo.mp4', { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('video', mp4File, `${Date.now()}-video.mp4`);

      const apiResponse = await uploadVideo(formData, config);
      console.log(apiResponse);
    }
  };

  return (
    <div>
      <h2>Video Recorder</h2>
      <main>
        <div>
          {!permission ? (
            <button onClick={getCameraPermission} type='button'>
              Get Camera Access
            </button>
          ) : null}
          {permission && !recordingStatus ? (
            <button onClick={startRecording} type='button'>
              Start Recording
            </button>
          ) : null}
          {recordingStatus ? (
            <button onClick={stopRecording} type='button'>
              Stop Recording
            </button>
          ) : null}
        </div>
      </main>

      <div className='video-player'>
        <VideoPlayer
          style={recordedVideo ? { display: 'none' } : undefined}
          ref={liveVideoPreview}
          autoPlay
        />
        {recordedVideo ? (
          <div className='recorded-player'>
            <VideoPlayer src={recordedVideo} controls />
          </div>
        ) : null}

        {recordedVideo && videoSize ? (
          <button onClick={handleUpload}>
            upload {videoSize.toFixed(2) + 'MB'} Video
          </button>
        ) : null}

        {uploadProgress ? <progress value={uploadProgress} /> : null}
      </div>
    </div>
  );
};

export default VideoRecorder;
