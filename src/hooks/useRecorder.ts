import { MutableRefObject, useRef, useState } from 'react';
import { MAX_VIDEO_LENGTH } from '../config/constants';

type ReturnType = [boolean, () => void, () => void, string | null];

const useRecorder = (
  stream: MediaStream | null,
  mimeType: string
): ReturnType => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoChunks, setVideoChunks] = useState<Blob[]>([]);
  const timerRef = useRef<Number | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    const media = new MediaRecorder(stream!, { mimeType });

    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localVideoChunks: Blob[] = [];

    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      localVideoChunks.push(event.data);
    });

    console.log('from start recording');

    timerRef.current = setTimeout(() => {
      stopRecording();
    }, MAX_VIDEO_LENGTH);
    setVideoChunks(localVideoChunks);
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current!.stop();

    mediaRecorder.current!.onstop = () => {
      const videoBlob = new Blob(videoChunks, { type: mimeType });
      const videoUrl = URL.createObjectURL(videoBlob);

      setRecordedVideo(videoUrl);
      setVideoChunks([]);
    };
  };

  return [isRecording, startRecording, stopRecording, recordedVideo];
};

export default useRecorder;
