import { forwardRef } from 'react';
import type { VideoHTMLAttributes } from 'react';

const VideoPlayer = forwardRef<
  HTMLVideoElement,
  VideoHTMLAttributes<HTMLVideoElement>
>((props, ref) => {
  return <video ref={ref} {...props} />;
});

export default VideoPlayer;
