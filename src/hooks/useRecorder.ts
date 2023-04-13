import { useRef, useState } from 'react';

import { MAX_VIDEO_LENGTH, mimeType } from '../config/constants';

import { videoChunksToBlobUrl } from '../utils/videoChunksToBlobUrl';
import { bytesToMB } from '../utils/bytesToMb';
import { toast } from 'react-hot-toast';

type TRecordedVideo = {
  url: string | null;
  file: File | null;
};

type TReturn = [
  boolean,
  () => void,
  () => void,
  null | number,
  TRecordedVideo,
  number
];

/**
 * reuseable video recorder hook
 * @param stream Media stream
 * @param setRecordedVideo callback to send back
 * @param setRecordTimer
 * @returns
 */

const useRecorder = (stream: MediaStream | null): TReturn => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const [recordTimer, setRecordTimer] = useState(0);
  const [recordedVideo, setRecordedVideo] = useState<TRecordedVideo>({
    url: null,
    file: null
  });

  const stopTimerRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const localChunks = useRef<Blob | null>(null);

  /**
   * on recording stop state normalizer
   * @param videoFile recorded video file
   * @param videoUrl recorded video url
   */
  const handleRecodingStop = (videoFile: File, videoUrl: string) => {
    setIsRecording(false);
    setVideoSize(bytesToMB(videoFile.size));
    setRecordedVideo({ url: videoUrl, file: videoFile });
    clearTimeout(stopTimerRef.current!);
    clearInterval(recordingTimerRef.current!);
    setRecordTimer(0);
  };

  /**
   * on stop recorder's event callback
   */
  const onStop = () => {
    if (localChunks.current) {
      videoChunksToBlobUrl(localChunks.current).then(
        ({ videoFile, videoUrl }) => {
          handleRecodingStop(videoFile, videoUrl);
        }
      );
    } else {
      toast.error('please reload the website and try again later');
    }
  };

  /**
   * on data available recorder's event callback
   * @param event Blob event which we receive recorded data from
   */
  const onDataAvailable = (event: BlobEvent) => {
    // pushing new data
    if (event.data && event.data.size > 0) {
      localChunks.current = event.data;
    }
  };

  /**
   * on recording start functionality
   */
  const onStart = () => {
    setRecordedVideo({ url: null, file: null });
    setIsRecording(true);

    stopTimerRef.current && clearTimeout(stopTimerRef.current);
    recordingTimerRef.current && clearInterval(recordingTimerRef.current);

    recordingTimerRef.current = setInterval(() => {
      setRecordTimer((prev) => prev + 1);
    }, 1000);

    stopTimerRef.current = setTimeout(() => {
      stopRecording();
    }, MAX_VIDEO_LENGTH + 100);
  };

  /**
   * responsible for starting recording
   */
  const startRecording = () => {
    const media = new MediaRecorder(stream!, { mimeType });

    mediaRecorder.current = media;

    mediaRecorder.current.start();

    mediaRecorder.current.addEventListener('start', onStart);
    mediaRecorder.current.addEventListener('dataavailable', onDataAvailable);
    mediaRecorder.current!.addEventListener('stop', onStop);
  };

  /**
   * Responsible for stopping recording
   */
  const stopRecording = () => {
    if (mediaRecorder.current!.state === 'recording') {
      mediaRecorder.current!.stop();
    }
  };

  return [
    isRecording,
    startRecording,
    stopRecording,
    videoSize,
    recordedVideo,
    recordTimer
  ];
};

export default useRecorder;
