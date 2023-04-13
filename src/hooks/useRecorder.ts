import { useRef, useState } from 'react';

import { MAX_VIDEO_LENGTH, mimeType } from '../config/constants';

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
 *
 * @param stream Media stream
 * @param setRecordedVideo callback to send back
 * @param setRecordTimer
 * @returns
 */

const useRecorder = (stream: MediaStream | null): TReturn => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<TRecordedVideo>({
    url: null,
    file: null
  });
  const [recordTimer, setRecordTimer] = useState(0);

  const stopTimerRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // on recording stop functionality
  const onStop = (videoFile: File, videoUrl: string) => {
    setIsRecording(false);
    setVideoSize(bytesToMB(videoFile.size));
    setRecordedVideo({ url: videoUrl, file: videoFile });
    clearInterval(recordingTimerRef.current!);
    setRecordTimer(0);
  };

  // responsible for stopping recording
  const stopRecording = () => {
    mediaRecorder.current!.stop();
    // clearing timer
    clearTimeout(stopTimerRef.current!);
    // converting chunks to url and setting data url
    videoChunksToBlobUrl(mediaRecorder.current!, videoChunks).then(
      ({ videoFile, videoUrl }) => {
        onStop(videoFile, videoUrl);
      }
    );
  };

  // on recording start functionality
  const onStart = () => {
    setRecordedVideo({ url: null, file: null });
    // checking if there is already a timer and recoded time interval
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current);
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }

    // recoded time
    recordingTimerRef.current = setInterval(() => {
      setRecordTimer((prev) => prev + 1);
    }, 1000);

    // auto stop record based on max video time length
    stopTimerRef.current = setTimeout(() => {
      stopRecording();
    }, MAX_VIDEO_LENGTH + 100);
    setIsRecording(true);
  };

  // responsible for starting recording
  const startRecording = () => {
    // creating new media recorder instance
    const media = new MediaRecorder(stream!, { mimeType });

    mediaRecorder.current = media;
    // starting recording
    mediaRecorder.current.start();

    // all video chunks
    let videoChunks: Blob[] = [];

    // listing for new data
    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      // pushing new data
      if (event.data && event.data.size > 0) {
        videoChunks.push(event.data);
      }
    });

    setVideoChunks(videoChunks);

    // handing timers and auto stop functionality
    mediaRecorder.current.addEventListener('start', onStart);
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
