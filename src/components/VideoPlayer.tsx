import { forwardRef } from 'react';
import type { LegacyRef } from 'react';

const VideoPlayer = forwardRef(
  (
    props: React.VideoHTMLAttributes<HTMLVideoElement>,
    ref: LegacyRef<HTMLVideoElement>
  ) => {
    return <video ref={ref} {...props} />;
  }
);

export default VideoPlayer;
