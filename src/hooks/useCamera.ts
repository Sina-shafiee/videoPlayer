import { useState } from 'react';
import type { MutableRefObject } from 'react';
import { toast } from 'react-hot-toast';

// hook return value's type as tuple
type ReturnType = [boolean, () => Promise<void>, MediaStream | null];

const useCamera = (
  liveVideoPreview: MutableRefObject<HTMLVideoElement | null>
): ReturnType => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getCameraPermission = async () => {
    if ('mediaDevices' in navigator) {
      try {
        const videoConstraints = {
          audio: false,
          video: true
        };
        const audioConstraints = { audio: true };

        // getting access to video and audio
        const audioStream = await navigator.mediaDevices.getUserMedia(
          audioConstraints
        );
        const videoStream = await navigator.mediaDevices.getUserMedia(
          videoConstraints
        );

        setPermission(true);

        // combine audio and video
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks()
        ]);

        // live preview
        liveVideoPreview!.current!.srcObject = videoStream;

        setStream(combinedStream);
      } catch (err: any) {
        console.error(err);
      }
    } else {
      toast.error(
        'Sorry dear visitor, Your device browser dose not support video recording... '
      );
    }
  };

  return [permission, getCameraPermission, stream];
};

export default useCamera;
