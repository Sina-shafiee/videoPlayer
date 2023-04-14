import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

import { MAX_VIDEO_LENGTH, MIME_TYPES } from '../config/constants';

import { videoChunksToBlobUrl } from '../utils/videoChunksToBlobUrl';
import { bytesToMB } from '../utils/bytesToMb';

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
 * @returns recording status, start recording, stop recording, video size, recorded video, and recording  timer
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
   * on data available recorder's event callback
   * @param event Blob event which we receive recorded data from
   */
  const onDataAvailable = (event: BlobEvent) => {
    if (event.data && event.data.size > 0) {
      localChunks.current = event.data;
    }
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
   * responsible for starting recording
   */
  const startRecording = () => {
    const supportedType = MIME_TYPES.filter((type) =>
      MediaRecorder.isTypeSupported(type)
    );

    if (!supportedType.length) {
      toast.error('Please update your browser');
      return;
    }

    const media = new MediaRecorder(stream!, {
      mimeType: supportedType[0]
    });

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
