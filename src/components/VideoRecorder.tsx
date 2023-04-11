import { useRef, useState } from 'react';
import useCamera from '../hooks/useCamera';
import useRecorder from '../hooks/useRecorder';
import VideoPlayer from './VideoPlayer';

const VideoRecorder = () => {
  const liveVideoPreview = useRef<HTMLVideoElement>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);

  const [permission, getCameraPermission, stream] = useCamera(liveVideoPreview);
  const [recordingStatus, startRecording, stopRecording, videoSize] =
    useRecorder(stream, setRecordedVideo);

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
      </div>
    </div>
  );
};

export default VideoRecorder;
