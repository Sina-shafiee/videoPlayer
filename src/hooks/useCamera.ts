import { MutableRefObject, useState } from 'react';
import { toast } from 'react-hot-toast';

type TReturn = [boolean, () => Promise<void>, MediaStream | null];

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
        const browserStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            width: { min: 320, ideal: 640, max: 1920 },
            height: { min: 200, ideal: 400, max: 720 }
          }
        });

        setPermission(true);

        // live preview
        if (liveVideoPreviewRef && liveVideoPreviewRef.current) {
          liveVideoPreviewRef.current.srcObject = browserStream;
        }

        setStream(browserStream);
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
