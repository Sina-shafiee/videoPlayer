import { MutableRefObject, useState } from 'react';

// hook return value's type as tuple
type ReturnType = [boolean, () => Promise<void>, MediaStream | null];

const useCamera = (
  liveVideoPreview: MutableRefObject<HTMLVideoElement | null>
): ReturnType => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const getCameraPermission = async () => {
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

      // set the permission to true
      setPermission(true);

      // combine audio and video
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...audioStream.getAudioTracks()
      ]);

      liveVideoPreview.current!.srcObject = videoStream;
      setStream(combinedStream);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return [permission, getCameraPermission, stream];
};

export default useCamera;
