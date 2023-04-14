import { MutableRefObject, useState } from 'react';
import { toast } from 'react-hot-toast';

type TReturn = [boolean, () => Promise<void>, MediaStream | null];

const videoConstraints = {
  video: {
    width: 1280,
    height: 720
  }
};
const audioConstraints = {
  audio: {
    // echoCancellation: { exact: true }
  }
};

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
        const audioStream =
          navigator.mediaDevices.getUserMedia(audioConstraints);
        const videoStream =
          navigator.mediaDevices.getUserMedia(videoConstraints);

        // reduce await time by awaiting both promises in same time
        const resolver = await Promise.all([audioStream, videoStream]);

        // combine audio and video
        const combinedStream = new MediaStream([
          ...resolver[0].getAudioTracks(),
          ...resolver[1].getVideoTracks()
        ]);

        setPermission(true);

        // live preview
        if (liveVideoPreviewRef && liveVideoPreviewRef.current) {
          liveVideoPreviewRef.current.srcObject = resolver[1];
        }

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
