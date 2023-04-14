import { MIME_TYPES } from '../config/constants';

export const supportedMimeType = () => {
  const types = MIME_TYPES.filter((type) =>
    MediaRecorder.isTypeSupported(type)
  );
  return types[0];
};
