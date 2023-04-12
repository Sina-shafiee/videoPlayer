import { memo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import useCamera from '../hooks/useCamera';
import useRecorder from '../hooks/useRecorder';

import VideoPlayer from './VideoPlayer';
import uploadVideo from '../api/uploadVideo';
import type { AxiosProgressEvent } from 'axios';

const VideoRecorder = memo(() => {
  const liveVideoPreview = useRef<HTMLVideoElement>(null);
  const [recordedVideo, setRecordedVideo] = useState<{
    url: string | null;
    file: File | null;
  }>({ url: null, file: null });

  const [uploadProgress, setUploadProgress] = useState(0);

  const [permission, getCameraPermission, stream] = useCamera(liveVideoPreview);
  const [recordingStatus, startRecording, stopRecording, videoSize] =
    useRecorder(stream, setRecordedVideo);

  // handle video upload functionality
  const handleUpload = async () => {
    // defining a config for handling progress bar
    const config = {
      onUploadProgress: function (progressEvent: AxiosProgressEvent) {
        // uploaded percentage
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total!
        );

        // value is lower than 100 then update progress bar with that value else if value is equal to 100 set progress value to 0 in order to hide progress bar during another recordings
        if (percentCompleted < 100) {
          setUploadProgress(percentCompleted);
        } else if (percentCompleted === 100) {
          setUploadProgress(0);
        }
      }
    };

    // appending video to formData and upload to the server
    if (recordedVideo.file) {
      const formData = new FormData();
      formData.append('video', recordedVideo.file, `${Date.now()}-video.webm`);

      try {
        const apiResponse = await uploadVideo(formData, config);
        // checking for response message
        if (apiResponse.message !== 'Ok') {
          throw new Error('failed');
        }

        toast.success('Video uploaded');
      } catch (error) {
        toast.error('Something went wrong, Please try again later..');
        console.error(error);
      }
    }
  };

  return (
    <>
      <h2>Video Recorder</h2>
      <section className='flex'>
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
        {uploadProgress ? (
          <div className='flex flex-wrap'>
            <p>uploaded {uploadProgress}%</p>
            <progress value={uploadProgress} max='100' />
          </div>
        ) : null}
      </section>

      <section>
        <VideoPlayer
          style={recordedVideo.url ? { display: 'none' } : undefined}
          ref={liveVideoPreview}
          className='video-player'
          autoPlay
        />
        {recordedVideo.url ? (
          <VideoPlayer
            className='video-player'
            src={recordedVideo.url}
            controls
          />
        ) : null}

        {recordedVideo.file && videoSize ? (
          <button onClick={handleUpload}>
            upload {videoSize.toFixed(2) + 'MB'} Video
          </button>
        ) : null}
      </section>
    </>
  );
});

export default VideoRecorder;
