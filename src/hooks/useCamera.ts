import { useState } from 'react';
import { toast } from 'react-hot-toast';

type TReturn = [boolean, () => Promise<void>, MediaStream | null];

const videoConstraints = { audio: false, video: true };
const audioConstraints = { audio: true };

/**
 * reuseable camera and microphone stream access
 * @param liveVideoPreviewRef optional live preview video element
 * @returns stream, permission and a function to get camera stream
 */
const useCamera = (liveVideoPreviewRef?: HTMLVideoElement | null): TReturn => {
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
        setPermission(true);

        // combine audio and video
        const combinedStream = new MediaStream([
          ...resolver[0].getAudioTracks(),
          ...resolver[1].getVideoTracks()
        ]);

        // live preview
        if (liveVideoPreviewRef) {
          liveVideoPreviewRef.srcObject = resolver[1];
        }

        setStream(combinedStream);
      } catch (err) {
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
