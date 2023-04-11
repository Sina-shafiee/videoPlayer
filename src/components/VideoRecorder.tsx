import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import useCamera from '../hooks/useCamera';
import useRecorder from '../hooks/useRecorder';

import VideoPlayer from './VideoPlayer';
import uploadVideo from '../api/uploadVideo';
import { AxiosProgressEvent, AxiosRequestConfig } from 'axios';

const VideoRecorder = () => {
  const liveVideoPreview = useRef<HTMLVideoElement>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(20);

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
    // we already checked the button responsible for this callback to not render if
    // recorded value dose not exist but here also am checking because of ts and i am lazy enough
    // to put a ! on line 41 :D
    if (recordedVideo) {
      // fetching saved blob url to create a file and upload them to the server
      const mediaBlob = await fetch(recordedVideo);
      const webmBlob = await mediaBlob.blob();

      const mp4File = new File([webmBlob], 'demo.mp4', { type: 'video/mp4' });

      const formData = new FormData();
      formData.append('video', mp4File, `${Date.now()}-video.mp4`);

      try {
        const apiResponse = await uploadVideo(formData, config);
        // checking for response message
        if (apiResponse.message !== 'Ok') {
          throw new Error('failed');
        }

        toast.success('Video uploaded');
      } catch (error) {
        toast.error('Something went wrong! please try again later');
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

      <section className='video-player'>
        <VideoPlayer
          style={recordedVideo ? { display: 'none' } : undefined}
          ref={liveVideoPreview}
          className='video-player'
          autoPlay
        />
        {recordedVideo ? (
          <VideoPlayer className='video-player' src={recordedVideo} controls />
        ) : null}

        {recordedVideo && videoSize ? (
          <button onClick={handleUpload}>
            upload {videoSize.toFixed(2) + 'MB'} Video
          </button>
        ) : null}
      </section>
    </>
  );
};

export default VideoRecorder;
