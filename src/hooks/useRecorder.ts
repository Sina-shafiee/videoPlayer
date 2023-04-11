import { Dispatch, useRef, useState } from 'react';
import { MAX_VIDEO_LENGTH, mimeType } from '../config/constants';
import { bytesToMB } from '../utils/bytesToMb';

type ReturnType = [boolean, () => void, () => void, null | number];

const useRecorder = (
  stream: MediaStream | null,
  setRecordedVideo: Dispatch<React.SetStateAction<string | null>>
): ReturnType => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const [videoSize, setVideoSize] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const convertVideoChunksToBlobUrl = (): Promise<string> => {
    return new Promise((resolve) => {
      mediaRecorder.current!.addEventListener('stop', () => {
        const videoBlob = new Blob(videoChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setIsRecording(false);
        setVideoSize(bytesToMB(videoBlob.size));
        setRecordedVideo(null);
        resolve(videoUrl);
      });
    });
  };
  const stopRecording = () => {
    mediaRecorder.current!.stop();
    // clearing timer
    clearTimeout(timerRef.current!);
    // converting chunks to url and setting data url
    convertVideoChunksToBlobUrl().then((dataUrl) => {
      setRecordedVideo(dataUrl);
    });
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

    //
    setVideoChunks(videoChunks);

    // auto stop recording after max video length time
    if (timerRef.current) {
      // checking if there is already a timer
      clearTimeout(timerRef.current);

      timerRef.current = setTimeout(() => {
        mediaRecorder.current!.stop();
        convertVideoChunksToBlobUrl().then((dataUrl) => {
          setRecordedVideo(dataUrl);
        });
      }, MAX_VIDEO_LENGTH);
    }
  };

  return [isRecording, startRecording, stopRecording, videoSize];
};

export default useRecorder;
