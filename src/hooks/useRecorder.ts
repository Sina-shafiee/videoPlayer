import { useRef, useState } from 'react';
import type { SetStateAction, Dispatch } from 'react';

import { MAX_VIDEO_LENGTH, mimeType } from '../config/constants';
import { bytesToMB } from '../utils/bytesToMb';
import { videoChunksToBlobUrl } from '../utils/videoChunksToBlobUrl';

type ReturnType = [boolean, () => void, () => void, null | number];

const useRecorder = (
  stream: MediaStream | null,
  setRecordedVideo: Dispatch<SetStateAction<string | null>>
): ReturnType => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const stopRecording = () => {
    mediaRecorder.current!.stop();
    // clearing timer
    clearTimeout(timerRef.current!);
    // converting chunks to url and setting data url
    videoChunksToBlobUrl(mediaRecorder, videoChunks).then(
      ({ videoBlob, videoUrl }) => {
        setIsRecording(false);
        setVideoSize(bytesToMB(videoBlob.size));
        setRecordedVideo(videoUrl);
      }
    );
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordedVideo(null);
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

    // checking if there is already a timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // auto stop recording after max video length time
    timerRef.current = setTimeout(() => {
      mediaRecorder.current!.stop();
      videoChunksToBlobUrl(mediaRecorder, videoChunks).then(
        ({ videoBlob, videoUrl }) => {
          setIsRecording(false);
          setVideoSize(bytesToMB(videoBlob.size));
          setRecordedVideo(videoUrl);
        }
      );
    }, MAX_VIDEO_LENGTH);
  };

  return [isRecording, startRecording, stopRecording, videoSize];
};

export default useRecorder;
