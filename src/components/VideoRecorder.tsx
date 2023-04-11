import { useRef } from 'react';
import useCamera from '../hooks/useCamera';
import useRecorder from '../hooks/useRecorder';

const mimeType = 'video/webm; codecs="opus,vp8"';

const VideoRecorder = () => {
  const liveVideoPreview = useRef<HTMLVideoElement>(null);
  const [permission, getCameraPermission, stream] = useCamera(liveVideoPreview);
  const [recordingStatus, startRecording, stopRecording, recordedVideo] =
    useRecorder(stream, mimeType);

  const handleUpload = () => {
    // upload video
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
        {!recordedVideo ? <video ref={liveVideoPreview} autoPlay /> : null}
        {recordedVideo ? (
          <div className='recorded-player'>
            <video src={recordedVideo} controls></video>
            <button onClick={handleUpload}>upload Recording</button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VideoRecorder;
