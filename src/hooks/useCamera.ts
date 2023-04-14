import { MutableRefObject, useState } from 'react';
import { toast } from 'react-hot-toast';

type TReturn = [boolean, () => Promise<void>, MediaStream | null];

const constraints = {
  audio: true,
  video: { width: 320, frameRate: { min: 20, ideal: 30, max: 60 } }
} as MediaStreamConstraints;

/**
 * reuseable camera and microphone stream hook
 * @param liveVideoPreviewRef live preview video element
 * @returns stream, permission and a function to get camera stream
 */
const useCamera = (
  liveVideoPreviewRef?: MutableRefObject<HTMLVideoElement | null>
): TReturn => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getCameraPermission = async () => {
    if ('mediaDevices' in navigator) {
      try {
        // getting video and audio stream
        const userStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        setPermission(true);

        // live preview
        if (liveVideoPreviewRef && liveVideoPreviewRef.current) {
          liveVideoPreviewRef.current.srcObject = userStream;
        }

        setStream(userStream);
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
