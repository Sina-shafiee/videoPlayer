import { useRef, useState } from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { MAX_VIDEO_LENGTH, mimeType } from '../config/constants';
import { bytesToMB } from '../utils/bytesToMb';
import { videoChunksToBlobUrl } from '../utils/videoChunksToBlobUrl';

type ReturnType = [boolean, () => void, () => void, null | number];

const useRecorder = (
  stream: MediaStream | null,
  setRecordedVideo: Dispatch<
    SetStateAction<{ url: string | null; file: File | null }>
  >,
  setRecordTimer: Dispatch<React.SetStateAction<number>>
): ReturnType => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const removeTimerRef = useRef<number | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  // on record stop functionality
  const onStop = (videoFile: File, videoUrl: string) => {
    setIsRecording(false);
    clearInterval(recordingTimerRef.current!);
    setRecordTimer(0);
    setVideoSize(bytesToMB(videoFile.size));
    setRecordedVideo({ url: videoUrl, file: videoFile });
  };

  // responsible for stopping recording
  const stopRecording = () => {
    mediaRecorder.current!.stop();
    // clearing timer
    clearTimeout(removeTimerRef.current!);
    // converting chunks to url and setting data url
    videoChunksToBlobUrl(mediaRecorder, videoChunks).then(
      ({ videoFile, videoUrl }) => {
        onStop(videoFile, videoUrl);
      }
    );
  };

  // responsible for starting recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordedVideo({ url: null, file: null });
    // creating new media recorder instance
    const media = new MediaRecorder(stream!, { mimeType });

    mediaRecorder.current = media;
    // starting recording
    mediaRecorder.current.start();

    // all video chunks
    let videoChunks: Blob[] = [];

    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      // pushing new data
      videoChunks.push(event.data);
    });

    setVideoChunks(videoChunks);

    // auto stop recording after max video length time
    mediaRecorder.current.addEventListener('start', () => {
      // checking if there is already a timer
      if (removeTimerRef.current) {
        clearTimeout(removeTimerRef.current);
      }

      recordingTimerRef.current = setInterval(() => {
        setRecordTimer((prev) => prev + 1);
      }, 1000);

      removeTimerRef.current = setTimeout(() => {
        mediaRecorder.current!.stop();
        videoChunksToBlobUrl(mediaRecorder, videoChunks).then(
          ({ videoFile, videoUrl }) => {
            onStop(videoFile, videoUrl);
          }
        );
      }, MAX_VIDEO_LENGTH + 100);
    });
  };

  return [isRecording, startRecording, stopRecording, videoSize];
};

export default useRecorder;
